import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Parse natural language input to extract task details
 * @param {string} transcript - The speech-to-text transcript
 * @returns {Promise<Object>} Parsed task data
 */
export const parseVoiceInput = async (transcript) => {
  // Use enhanced rule-based parsing if no Groq API key
  // This is free and works well for most common task inputs
  if (!process.env.GROQ_API_KEY) {
    console.log('Using enhanced rule-based parsing (no Groq API key provided)');
    return parseWithoutAI(transcript);
  }

  try {
    const prompt = `You are a task parsing assistant. Extract task information from the following natural language input. Return ONLY a valid JSON object with the following structure:
{
  "title": "extracted task title",
  "description": "extracted description or empty string",
  "priority": "Low" | "Medium" | "High" | "Critical" (default: "Medium"),
  "dueDate": "ISO date string or null",
  "status": "To Do" | "In Progress" | "Done" (default: "To Do")
}

Rules:
- Title: Extract the main task description, remove filler words like "remind me to", "create a task to", etc.
- Priority: Look for keywords like "urgent", "high priority", "critical", "low priority", "important"
- Due Date: Parse relative dates ("tomorrow", "next Monday", "in 3 days", "by Friday") and absolute dates ("15th January", "Jan 20", "2024-01-15", "20th December at 9:00 p.m"). 
  IMPORTANT: When parsing dates with times, interpret the time as LOCAL TIME (not UTC). For example, "20th December at 9:00 p.m" means December 20 at 21:00 in the user's local timezone.
  Convert to ISO 8601 format (the date should represent the local time correctly when converted). If time is mentioned (e.g., "tomorrow evening", "6 PM", "9:00 p.m"), include it. Return null if no date is mentioned.
- Status: Default to "To Do" unless explicitly mentioned
- Description: Extract any additional context or details

Input: "${transcript}"

Return ONLY the JSON object, no additional text:`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts structured task data from natural language. Always return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const content = response.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    const parsed = JSON.parse(jsonString);
    
    // Validate and normalize the response
    return {
      title: parsed.title || extractTitle(transcript),
      description: parsed.description || '',
      priority: ['Low', 'Medium', 'High', 'Critical'].includes(parsed.priority) 
        ? parsed.priority 
        : 'Medium',
      dueDate: parsed.dueDate || null,
      status: ['To Do', 'In Progress', 'Done'].includes(parsed.status)
        ? parsed.status
        : 'To Do'
    };
  } catch (error) {
    console.error('Groq parsing error:', error);
    // Fallback to rule-based parsing
    return parseWithoutAI(transcript);
  }
};

/**
 * Enhanced rule-based parsing without AI
 * This is the default parser when OpenAI API is not available
 */
const parseWithoutAI = (transcript) => {
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract priority with more keywords
  let priority = 'Medium';
  const priorityPatterns = {
    'Critical': ['critical', 'urgent', 'asap', 'immediately', 'emergency', 'urgently'],
    'High': ['high priority', 'important', 'priority', 'high', 'must', 'need'],
    'Low': ['low priority', 'low', 'whenever', 'eventually', 'someday']
  };
  
  for (const [level, keywords] of Object.entries(priorityPatterns)) {
    if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
      priority = level;
      break; // Take the first match (Critical > High > Low)
    }
  }

  // Extract status
  let status = 'To Do';
  if (lowerTranscript.includes('in progress') || lowerTranscript.includes('working on')) {
    status = 'In Progress';
  } else if (lowerTranscript.includes('done') || lowerTranscript.includes('completed') || lowerTranscript.includes('finished')) {
    status = 'Done';
  }

  // Extract title (improved cleaning)
  let title = transcript;
  
  // Remove common prefixes
  title = title.replace(/^(remind me to|create a task to|i need to|task:|todo:|add task|new task|create|make)\s*/i, '').trim();
  
  // Remove priority mentions from title
  title = title.replace(/\b(high|low|medium|critical|urgent|important)\s+priority\b/gi, '').trim();
  title = title.replace(/\b(urgent|critical|important|asap)\b/gi, '').trim();
  
  // Remove date/time mentions from title (more comprehensive)
  title = title.replace(/\b(by|before|on|due|at|until)\s+[^,\.]+/gi, '').trim();
  title = title.replace(/\b(tomorrow|today|next week|next monday|next tuesday|next wednesday|next thursday|next friday|next saturday|next sunday|in \d+ days?)\b/gi, '').trim();
  
  // Remove status mentions
  title = title.replace(/\b(to do|in progress|done|completed|finished)\b/gi, '').trim();
  
  // Clean up extra spaces and punctuation
  title = title.replace(/\s+/g, ' ').trim();
  title = title.replace(/^[,\-\.\s]+|[,\-\.\s]+$/g, '').trim();
  
  if (!title || title.length < 3) {
    title = transcript;
  }

  // Extract description (text after common separators)
  let description = '';
  const descSeparators = [',', ' - ', ':', ' and ', ' also '];
  for (const sep of descSeparators) {
    const parts = transcript.split(sep);
    if (parts.length > 1) {
      // Take text after separator as potential description
      const potentialDesc = parts.slice(1).join(sep).trim();
      // Remove date/priority mentions from description
      const cleanDesc = potentialDesc
        .replace(/\b(by|before|on|due|at|tomorrow|next week|high priority|low priority|critical|urgent)\b/gi, '')
        .trim();
      if (cleanDesc.length > 10 && cleanDesc.length < 200) {
        description = cleanDesc;
        break;
      }
    }
  }

  // Extract due date (enhanced parsing)
  const dueDate = parseRelativeDate(transcript);

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: description,
    priority,
    dueDate,
    status
  };
};

/**
 * Extract title from transcript
 */
const extractTitle = (transcript) => {
  let title = transcript
    .replace(/^(remind me to|create a task to|i need to|task:|todo:)/i, '')
    .trim();
  
  if (!title) {
    title = transcript;
  }
  
  return title.charAt(0).toUpperCase() + title.slice(1);
};

/**
 * Enhanced date parsing from text
 */
const parseRelativeDate = (text) => {
  const lowerText = text.toLowerCase();
  const now = new Date();
  
  // Today
  if (lowerText.includes('today')) {
    const today = new Date(now);
    // Extract time if mentioned
    const timeMatch = lowerText.match(/(\d{1,2})\s*(am|pm|:?\d{2})?/);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const isPM = lowerText.includes('pm') || (hour < 12 && lowerText.includes('evening'));
      today.setHours(isPM && hour !== 12 ? hour + 12 : hour, 0, 0, 0);
    }
    return today.toISOString();
  }
  
  // Tomorrow
  if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check for time mentions
    if (lowerText.includes('evening') || lowerText.match(/tomorrow\s+(\d+)\s*pm/i)) {
      const pmMatch = lowerText.match(/tomorrow\s+(\d+)\s*pm/i);
      if (pmMatch) {
        tomorrow.setHours(parseInt(pmMatch[1]) + 12, 0, 0, 0);
      } else {
        tomorrow.setHours(18, 0, 0, 0);
      }
    } else if (lowerText.includes('morning')) {
      tomorrow.setHours(9, 0, 0, 0);
    } else if (lowerText.includes('afternoon')) {
      tomorrow.setHours(14, 0, 0, 0);
    } else if (lowerText.match(/tomorrow\s+(\d+)\s*am/i)) {
      const amMatch = lowerText.match(/tomorrow\s+(\d+)\s*am/i);
      tomorrow.setHours(parseInt(amMatch[1]), 0, 0, 0);
    }
    
    return tomorrow.toISOString();
  }
  
  // Next week
  if (lowerText.includes('next week')) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString();
  }
  
  // Days from now
  const daysMatch = lowerText.match(/in\s+(\d+)\s+days?/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString();
  }
  
  // Day of week (enhanced)
  const daysOfWeek = [
    { names: ['sunday', 'sun'], value: 0 },
    { names: ['monday', 'mon'], value: 1 },
    { names: ['tuesday', 'tue', 'tues'], value: 2 },
    { names: ['wednesday', 'wed'], value: 3 },
    { names: ['thursday', 'thu', 'thur', 'thurs'], value: 4 },
    { names: ['friday', 'fri'], value: 5 },
    { names: ['saturday', 'sat'], value: 6 }
  ];
  
  for (const day of daysOfWeek) {
    if (day.names.some(name => lowerText.includes(name))) {
      const targetDay = day.value;
      const currentDay = now.getDay();
      let daysUntil = (targetDay - currentDay + 7) % 7;
      if (daysUntil === 0) daysUntil = 7; // Next occurrence
      
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + daysUntil);
      
      // Extract time if mentioned
      if (lowerText.includes('evening')) {
        nextDay.setHours(18, 0, 0, 0);
      } else if (lowerText.includes('morning')) {
        nextDay.setHours(9, 0, 0, 0);
      } else if (lowerText.includes('afternoon')) {
        nextDay.setHours(14, 0, 0, 0);
      }
      
      return nextDay.toISOString();
    }
  }
  
  // Absolute dates (basic support)
  // Format: "January 15", "Jan 20", "15th January", "1/15", "2024-01-15"
  const datePatterns = [
    /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/, // MM/DD or MM/DD/YYYY
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/i,
    /(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i
  ];
  
  const months = {
    'january': 0, 'jan': 0, 'february': 1, 'feb': 1, 'march': 2, 'mar': 2,
    'april': 3, 'apr': 3, 'may': 4, 'june': 5, 'jun': 5, 'july': 6, 'jul': 6,
    'august': 7, 'aug': 7, 'september': 8, 'sep': 8, 'october': 9, 'oct': 9,
    'november': 10, 'nov': 10, 'december': 11, 'dec': 11
  };
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      let month, day, year = now.getFullYear();
      
      if (pattern.source.includes('/')) {
        // MM/DD format
        month = parseInt(match[1]) - 1;
        day = parseInt(match[2]);
        if (match[3]) year = parseInt(match[3].length === 2 ? '20' + match[3] : match[3]);
      } else {
        // Month name format
        const monthName = match[1]?.toLowerCase() || match[2]?.toLowerCase();
        month = months[monthName];
        day = parseInt(match[2] || match[1]);
      }
      
      const date = new Date(year, month, day);
      
      // Extract time from text (handles formats like "9:00 p.m", "9 pm", "21:00", "at 9:00 p.m")
      const timePatterns = [
        /(\d{1,2}):?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)/i,  // "9:00 pm", "9 pm", "9:30 a.m."
        /at\s+(\d{1,2}):?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)/i,  // "at 9:00 pm"
        /(\d{1,2}):(\d{2})/  // 24-hour format "21:00"
      ];
      
      let hour = 0, minute = 0;
      for (const timePattern of timePatterns) {
        const timeMatch = lowerText.match(timePattern);
        if (timeMatch) {
          hour = parseInt(timeMatch[1]);
          minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
          
          // Handle AM/PM
          if (timeMatch[3]) {
            const isPM = timeMatch[3].toLowerCase().includes('p');
            if (isPM && hour !== 12) {
              hour += 12;
            } else if (!isPM && hour === 12) {
              hour = 0;
            }
          }
          // If 24-hour format and hour >= 12, it's already in 24-hour format
          
          break;
        }
      }
      
      // Set the time on the date
      date.setHours(hour, minute, 0, 0);
      
      // If the date is in the past, try next year
      if (date <= now) {
        date.setFullYear(year + 1);
      }
      
      if (date > now) {
        return date.toISOString();
      }
    }
  }
  
  return null;
};


# Groq API Setup Guide

## What is Groq?

Groq is a **FREE** API service that provides fast inference with open-source language models like Llama 3.3 70B. It's perfect for this project because:

- ✅ **100% FREE** - No credit card required
- ✅ **Fast inference** - Optimized for speed
- ✅ **Open-source models** - Uses Llama 3.3 70B
- ✅ **Easy to use** - Similar API to OpenAI

## Getting Your Free Groq API Key

1. **Sign up for free**:
   - Go to https://console.groq.com
   - Click "Sign Up" or "Log In"
   - Create a free account (no credit card needed)

2. **Create API Key**:
   - Navigate to https://console.groq.com/keys
   - Click "Create API Key"
   - Copy your API key (starts with `gsk_`)
   - **Important**: Save it immediately, it's only shown once!

3. **Add to your `.env` file**:
   ```env
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

## Installation

The Groq SDK is already included in `package.json`. Just install dependencies:

```bash
cd backend
npm install
```

This will install `groq-sdk` package automatically.

## How It Works

1. **With Groq API Key**: Uses Llama 3.3 70B model for intelligent parsing
2. **Without API Key**: Falls back to enhanced rule-based parsing (still works great!)

## Model Used

- **Model**: `llama-3.3-70b-versatile`
- **Why**: Fast, accurate, and free with Groq

## Rate Limits

Groq has generous free tier limits:
- Check your current limits at https://console.groq.com
- If you hit limits, the app automatically falls back to rule-based parsing

## Troubleshooting

**API Key not working?**
- Verify the key starts with `gsk_`
- Check it's correctly set in `backend/.env`
- Ensure no extra spaces or quotes

**Rate limit errors?**
- The app will automatically use rule-based parsing as fallback
- Check your usage at https://console.groq.com

**Connection errors?**
- Verify your internet connection
- Check Groq status at https://status.groq.com

## Benefits Over OpenAI

- ✅ **FREE** - No paid subscription needed
- ✅ **Fast** - Optimized inference speed
- ✅ **Open-source** - Uses Llama models
- ✅ **No credit card** - Sign up and use immediately

---

**Ready to use!** Just add your `GROQ_API_KEY` to `backend/.env` and you're all set!


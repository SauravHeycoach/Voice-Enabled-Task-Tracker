import express from 'express';
import { parseVoiceInput } from '../services/voiceParser.js';

const router = express.Router();

// Parse voice transcript
router.post('/parse', async (req, res, next) => {
  try {
    const { transcript } = req.body;
    
    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
      return res.status(400).json({
        error: 'Transcript is required and must be a non-empty string'
      });
    }

    const parsedData = await parseVoiceInput(transcript);
    
    res.json({
      success: true,
      transcript: transcript.trim(),
      parsed: parsedData
    });
  } catch (error) {
    next(error);
  }
});

export default router;


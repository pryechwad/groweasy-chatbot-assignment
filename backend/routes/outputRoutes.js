const express = require('express');
const {
  getChatOutput,
  getChatTranscriptText,
  getAllOutputs
} = require('../controllers/outputController');

const router = express.Router();

// GET /api/output/:sessionId - Get chat transcript and classification (JSON)
router.get('/:sessionId', getChatOutput);

// GET /api/output/:sessionId/text - Get chat transcript as plain text
router.get('/:sessionId/text', getChatTranscriptText);

// GET /api/output - Get all completed sessions with classifications
router.get('/', getAllOutputs);

module.exports = router;
const express = require('express');
const { sendMessage, classifyLead } = require('../controllers/chatController');

const router = express.Router();

// POST /api/chat/message - Send chat message
router.post('/message', sendMessage);

// POST /api/chat/classify/:sessionId - Classify lead
router.post('/classify/:sessionId', classifyLead);

module.exports = router;
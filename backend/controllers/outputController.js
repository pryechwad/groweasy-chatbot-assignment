const Lead = require('../models/Lead');

// Get chat transcript and classification
const getChatOutput = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const lead = await Lead.findOne({ sessionId });
    if (!lead) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Format chat transcript
    const chatTranscript = {
      leadInfo: {
        name: lead.name,
        phone: lead.phone,
        source: lead.source
      },
      messages: lead.chatHistory.map(msg => ({
        sender: msg.sender,
        message: msg.message,
        timestamp: msg.timestamp
      })),
      totalMessages: lead.chatHistory.length,
      userMessages: lead.chatHistory.filter(m => m.sender === 'user').length,
      botMessages: lead.chatHistory.filter(m => m.sender === 'bot').length
    };

    // Final classification
    const finalClassification = {
      status: lead.status || 'New',
      confidence: lead.classification?.confidence || 0,
      reason: lead.classification?.reason || 'Not yet classified',
      extractedMetadata: lead.classification?.extractedData || {},
      nextActions: lead.classification?.nextActions || []
    };

    res.json({
      success: true,
      data: {
        sessionId: lead.sessionId,
        chatTranscript,
        finalClassification,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get output error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get chat transcript as plain text
const getChatTranscriptText = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const lead = await Lead.findOne({ sessionId });
    if (!lead) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let transcript = `CHAT TRANSCRIPT\n`;
    transcript += `================\n`;
    transcript += `Lead: ${lead.name}\n`;
    transcript += `Source: ${lead.source}\n`;
    transcript += `Session ID: ${lead.sessionId}\n`;
    transcript += `Date: ${lead.createdAt.toDateString()}\n\n`;

    lead.chatHistory.forEach(msg => {
      const time = msg.timestamp.toLocaleTimeString();
      const sender = msg.sender === 'user' ? lead.name : 'Agent';
      transcript += `[${time}] ${sender}: ${msg.message}\n`;
    });

    transcript += `\nFINAL CLASSIFICATION\n`;
    transcript += `===================\n`;
    transcript += `Status: ${lead.status || 'New'}\n`;
    transcript += `Confidence: ${(lead.classification?.confidence * 100 || 0).toFixed(1)}%\n`;
    transcript += `Reason: ${lead.classification?.reason || 'Not classified'}\n`;
    
    if (lead.classification?.extractedData) {
      transcript += `\nExtracted Data:\n`;
      Object.entries(lead.classification.extractedData).forEach(([key, value]) => {
        transcript += `- ${key}: ${value}\n`;
      });
    }

    res.setHeader('Content-Type', 'text/plain');
    res.send(transcript);
  } catch (error) {
    console.error('Get transcript error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all completed sessions with classifications
const getAllOutputs = async (req, res) => {
  try {
    const { status, limit = 10 } = req.query;
    
    const filter = { status: { $ne: 'New' } }; // Only classified leads
    if (status) filter.status = status;

    const leads = await Lead.find(filter)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    const outputs = leads.map(lead => ({
      sessionId: lead.sessionId,
      leadInfo: {
        name: lead.name,
        source: lead.source,
        createdAt: lead.createdAt
      },
      chatSummary: {
        totalMessages: lead.chatHistory.length,
        lastMessage: lead.chatHistory[lead.chatHistory.length - 1]?.message || '',
        duration: Math.round((lead.updatedAt - lead.createdAt) / 60000) // minutes
      },
      classification: {
        status: lead.status,
        confidence: lead.classification?.confidence || 0,
        reason: lead.classification?.reason || '',
        extractedData: lead.classification?.extractedData || {}
      }
    }));

    res.json({
      success: true,
      data: {
        outputs,
        total: outputs.length,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get all outputs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getChatOutput,
  getChatTranscriptText,
  getAllOutputs
};
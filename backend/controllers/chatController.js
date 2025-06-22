const { generateChatResponse } = require('../config/openai');
const Lead = require('../models/Lead');

// Send chat message
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    let lead = null;
    if (sessionId) {
      lead = await Lead.findOne({ sessionId });
    }
    
    // Create a new lead if none exists
    if (!lead) {
      lead = new Lead({
        name: 'Lead ' + Math.floor(Math.random() * 1000),
        source: 'website',
        status: 'Cold',
        sessionId: sessionId || 'session_' + Date.now(),
        chatHistory: []
      });
      await lead.save();
    }

    // Get existing chat history
    const chatHistory = lead.chatHistory || [];
    
    // Generate AI response with existing chat history (before adding new user message)
    const reply = await generateChatResponse(message, lead?.classification?.extractedData || {}, chatHistory);

    // Check if this is a site visit confirmation message
    const isSiteVisitConfirmation = reply.includes("Your site visit is confirmed") || 
                                  reply.includes("receive details shortly") || 
                                  reply.includes("executive will contact you");

    // Check if the welcome message is being repeated
    const isRepeatingWelcome = chatHistory.length > 0 && 
                             reply.includes("Welcome to GrowEasy Realtors") && 
                             reply.includes("buy or rent");
    
    // Determine the final reply to send back
    let finalReply = reply;
    if (isRepeatingWelcome) {
      finalReply = "I understand. How can I help with your property search today?";
    }

    // Update the lead with new messages
    lead.chatHistory.push({ sender: 'user', message, timestamp: new Date() });
    lead.chatHistory.push({ sender: 'bot', message: finalReply, timestamp: new Date() });
    
    // If this is a site visit confirmation, update the lead status to Hot
    if (isSiteVisitConfirmation) {
      lead.status = 'Hot';
    }
    
    await lead.save();
    
    res.json({
      success: true,
      data: {
        reply: finalReply,
        timestamp: new Date(),
        sessionId: lead.sessionId,
        isSiteVisitConfirmation: isSiteVisitConfirmation
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Classify lead based on conversation
const classifyLead = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const lead = await Lead.findOne({ sessionId });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const userMessages = lead.chatHistory
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.message.toLowerCase());

    // Simple classification logic
    let status = 'Cold';
    let confidence = 0.5;
    let reason = 'General inquiry';
    const extractedData = {};

    // Extract data
    const allText = userMessages.join(' ');
    
    // Location
    const cities = ['pune', 'mumbai', 'delhi', 'bangalore', 'hyderabad'];
    const foundCity = cities.find(city => allText.includes(city));
    if (foundCity) extractedData.location = foundCity;

    // Budget
    const budgetMatch = allText.match(/(\\d+)\\s*(l|lakh|cr|crore)/);
    if (budgetMatch) extractedData.budget = budgetMatch[0];

    // Property type
    const propertyTypes = ['flat', 'villa', 'plot', '1bhk', '2bhk', '3bhk'];
    const foundType = propertyTypes.find(type => allText.includes(type));
    if (foundType) extractedData.propertyType = foundType;

    // Timeline
    if (allText.includes('urgent') || allText.includes('immediate') || allText.match(/\\d+\\s*(month|week)/)) {
      extractedData.timeline = 'urgent';
    }

    // Calculate score
    let score = 0;
    if (extractedData.location) score += 0.3;
    if (extractedData.budget) score += 0.3;
    if (extractedData.timeline === 'urgent') score += 0.2;
    if (extractedData.propertyType) score += 0.2;

    if (score >= 0.7) {
      status = 'Hot';
      confidence = score;
      reason = 'High intent with specific requirements';
    } else if (score >= 0.3) {
      status = 'Cold';
      confidence = 1 - score;
      reason = 'Some interest but lacks specificity';
    }

    // Check for invalid
    const invalidPatterns = /^[a-z]{5,}$|^\\d{5,}$/;
    const invalidCount = userMessages.filter(msg => invalidPatterns.test(msg)).length;
    if (invalidCount / userMessages.length > 0.5) {
      status = 'Invalid';
      confidence = 0.9;
      reason = 'Spam or non-serious responses';
    }

    // Update lead
    lead.status = status;
    lead.classification = {
      confidence,
      reason,
      extractedData,
      nextActions: status === 'Hot' ? ['Schedule call', 'Send properties'] : ['Follow up later']
    };
    await lead.save();

    res.json({
      success: true,
      data: {
        status,
        confidence,
        reason,
        extractedData,
        nextActions: lead.classification.nextActions
      }
    });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendMessage,
  classifyLead
};
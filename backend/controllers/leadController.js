const Lead = require('../models/Lead');

// Create new lead
const createLead = async (req, res) => {
  try {
    const { name, phone, email, source, initialMessage } = req.body;

    if (!name || !source) {
      return res.status(400).json({ error: 'Name and source are required' });
    }

    const sessionId = Date.now().toString();
    const greeting = `Welcome to GrowEasy Realtors! 🏠 Hi ${name}! I'm Sarah, your property consultant. Are you looking to buy or rent a property?`;

    const lead = new Lead({
      name,
      phone,
      email,
      source,
      sessionId,
      chatHistory: [{
        sender: 'bot',
        message: greeting,
        timestamp: new Date()
      }]
    });

    if (initialMessage) {
      lead.chatHistory.push({
        sender: 'user',
        message: initialMessage,
        timestamp: new Date()
      });
    }

    await lead.save();

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        leadId: lead._id,
        greeting,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all leads
const getLeads = async (req, res) => {
  try {
    const { status, source, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;

    const leads = await Lead.find(filter)
      .select('-chatHistory') // Exclude chat history for list view
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lead.countDocuments(filter);

    res.json({
      success: true,
      data: {
        leads,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single lead
const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get lead by session ID
const getLeadBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const lead = await Lead.findOne({ sessionId });
    if (!lead) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead by session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update lead
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findByIdAndUpdate(id, updates, { new: true });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get lead statistics
const getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Lead.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Lead.countDocuments({ createdAt: { $gte: today } });

    res.json({
      success: true,
      data: {
        total,
        today: todayCount,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id || 'New'] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  getLeadBySession,
  updateLead,
  deleteLead,
  getLeadStats
};
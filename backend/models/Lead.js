const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  source: {
    type: String,
    required: true,
    enum: ['website', 'facebook', 'google', 'referral', 'other']
  },
  status: {
    type: String,
    enum: ['Hot', 'Cold', 'Invalid', 'New'],
    default: 'New'
  },
  classification: {
    confidence: Number,
    reason: String,
    extractedData: {
      location: String,
      propertyType: String,
      budget: String,
      timeline: String,
      purpose: String
    },
    nextActions: [String]
  },
  chatHistory: [{
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
leadSchema.index({ sessionId: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
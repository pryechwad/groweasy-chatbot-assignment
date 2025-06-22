const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'system', 'classification'],
    default: 'text'
  },
  metadata: {
    confidence: Number,
    extractedData: mongoose.Schema.Types.Mixed,
    classification: String
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ sessionId: 1, createdAt: 1 });
messageSchema.index({ leadId: 1 });

module.exports = mongoose.model('Message', messageSchema);
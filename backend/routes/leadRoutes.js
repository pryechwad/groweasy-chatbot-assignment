const express = require('express');
const {
  createLead,
  getLeads,
  getLead,
  getLeadBySession,
  updateLead,
  deleteLead,
  getLeadStats
} = require('../controllers/leadController');

const router = express.Router();

// POST /api/leads - Create new lead
router.post('/', createLead);

// GET /api/leads - Get all leads with filtering
router.get('/', getLeads);

// GET /api/leads/stats - Get lead statistics
router.get('/stats', getLeadStats);

// GET /api/leads/session/:sessionId - Get lead by session ID
router.get('/session/:sessionId', getLeadBySession);

// GET /api/leads/:id - Get single lead
router.get('/:id', getLead);

// PUT /api/leads/:id - Update lead
router.put('/:id', updateLead);

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', deleteLead);

module.exports = router;
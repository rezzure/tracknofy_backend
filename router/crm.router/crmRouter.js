const express = require('express');
const router = express.Router();

const {
  addLead,
  updateLead,
  updateBasicDetails,
  addConversation,
  getAllLeads,
  getLeadById,
  getLeadConversations,
  deleteLead
} = require('../../controllers/leadController/leadController');

// Lead routes
router.post('/add/lead', addLead);
router.get('/leads', getAllLeads);
router.get('/lead/:id', getLeadById);
router.put('/edit/lead/:id', updateLead);
router.put('/update/lead/basic/:id', updateBasicDetails);
router.post('/lead/:id/conversation', addConversation);
router.get('/lead/:id/conversations', getLeadConversations);
router.delete('/lead/:id', deleteLead);

module.exports = router;
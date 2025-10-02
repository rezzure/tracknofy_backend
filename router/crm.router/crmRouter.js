// const express = require('express');
// const router = express.Router();

// const {
//   addLead,
//   updateLead,
//   updateBasicDetails,
//   addConversation,
//   getAllLeads,
//   getLeadById,
//   getLeadConversations,
//   deleteLead
// } = require('../../controllers/leadController/leadController');

// // Lead routes
// router.post('/add/lead', addLead);
// router.get('/leads', getAllLeads);
// router.get('/lead/:id', getLeadById);
// router.put('/edit/lead/:id', updateLead);
// router.put('/update/lead/basic/:id', updateBasicDetails);
// router.post('/lead/:id/conversation', addConversation);
// router.get('/lead/:id/conversations', getLeadConversations);
// router.delete('/lead/:id', deleteLead);

// module.exports = router;


// active and inactive lead status 


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
  updateLeadStatus, // NEW: Import the new function
  deleteLead
} = require('../../controllers/leadController/leadController');

// Lead routes
router.post('/add/lead', addLead);
router.put('/edit/lead/:id', updateLead);
router.put('/update/lead/basic/:id', updateBasicDetails);
router.post('/lead/:id/conversation', addConversation);
router.get('/leads', getAllLeads); // Now supports ?status=active or ?status=inactive
router.get('/lead/:id', getLeadById);
router.get('/lead/:id/conversations', getLeadConversations);
router.put('/lead/:id', updateLeadStatus); // NEW: Route for updating lead status
router.delete('/lead/:id', deleteLead);

module.exports = router;
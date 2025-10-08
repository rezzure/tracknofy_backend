const express = require("express");
const { getTicketsAssignedToUser, getTicketById, addTicketCommunication, resolveTicket, updateStatus } = require("../../controllers/Admin/AssinedTicketUser/assiendUser");
const getAssignUserSite = require("../../controllers/Admin/Material&Purchase/getAssignUserSite");
const router = express.Router();




// Get tickets assigned to specific user
router.get("/tickets/assigned-to/:userId", getTicketsAssignedToUser);

// Get specific ticket details
router.get("/tickets/:ticketId", getTicketById);


// Add communication to ticket
router.patch("/tickets/:ticketId/communication", addTicketCommunication);

// Resolve ticket with resolution notes
router.patch("/tickets/:ticketId/resolve", resolveTicket);

router.patch("/status/:entityType/:entityId", updateStatus);


router.get('/get/assignUserSite', getAssignUserSite)

module.exports = router;
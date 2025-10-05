const express = require("express");
const { getTicketsAssignedToUser, getTicketById, updateTicketStatus, addTicketCommunication, resolveTicket } = require("../../controllers/Admin/AssinedTicketUser/assiendUser");
const router = express.Router();


//  `${backendURL}/api/tickets/assigned-to/${userId}`,

// Get tickets assigned to specific user
router.get("/tickets/assigned-to/:userId", getTicketsAssignedToUser);

// Get specific ticket details
router.get("/tickets/:ticketId", getTicketById);

// Update ticket status
router.patch("/tickets/:ticketId/status", updateTicketStatus);

// Add communication to ticket
router.patch("/tickets/:ticketId/communication", addTicketCommunication);

// Resolve ticket with resolution notes
router.patch("/tickets/:ticketId/resolve", resolveTicket);

module.exports = router;
const Query = require("../../Schema/query.schema/query.model");
const Ticket = require("../../Schema/ticket.Schema/ticket.modal");


// Create new ticket
const createTicket = async (req, res) => {
  try {
    const {
      queryId,
      title,
      description,
      assignedTo,
      assignedToName,
      assignedRole,
      assignedBy,
      assignedById,
      priority,
      dueDate,
      notes,
    } = req.body;

    // Check if query exists
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    // Create new ticket
    const ticket = new Ticket({
      queryId,
      title,
      description,
      assignedTo,
      assignedToName,
      assignedRole,
      assignedBy,
      assignedById,
      priority,
      dueDate,
      notes,
    });

    await ticket.save();

    // Populate the saved ticket
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('assignedTo', 'name email')
      .populate('assignedById', 'name')
      .populate('queryId');

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: populatedTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all tickets (for admin)
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('assignedTo', 'name email')
      .populate('assignedById', 'name')
      .populate('queryId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get tickets by assigned user
const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await Ticket.find({ assignedTo: userId })
      .populate('assignedTo', 'name email')
      .populate('assignedById', 'name')
      .populate('queryId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User tickets fetched successfully",
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, resolutionNotes, resolvedBy, resolvedByName } = req.body;

    const updateData = { status };

    // Add resolution info if status is resolved
    if (status === "resolved") {
      updateData.resolutionNotes = resolutionNotes;
      updateData.resolvedBy = resolvedBy;
      updateData.resolvedByName = resolvedByName;
      updateData.resolvedAt = new Date();
    }

    // Add closed info if status is closed
    if (status === "closed") {
      updateData.closedAt = new Date();
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      updateData,
      { new: true }
    )
      .populate('assignedTo', 'name email')
      .populate('assignedById', 'name')
      .populate('queryId');

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Also update the associated query status if ticket is resolved or closed
    if (status === "resolved" || status === "closed") {
      await Query.findByIdAndUpdate(
        updatedTicket.queryId,
        { 
          status: status === "resolved" ? "resolved" : "closed",
          resolvedBy: resolvedBy,
          resolvedByName: resolvedByName,
          resolutionNotes: resolutionNotes,
          resolvedAt: new Date(),
          ...(status === "closed" && { closedAt: new Date() })
        }
      );
    }

    res.status(200).json({
      success: true,
      message: `Ticket ${status} successfully`,
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Add communication to ticket
const addTicketCommunication = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { sender, senderName, senderRole, message, attachments } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const newCommunication = {
      sender,
      senderName,
      senderRole,
      message,
      attachments: attachments || [],
      sentAt: new Date(),
    };

    ticket.communications.push(newCommunication);
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticketId)
      .populate('assignedTo', 'name email')
      .populate('assignedById', 'name')
      .populate('queryId');

    res.status(200).json({
      success: true,
      message: "Communication added successfully",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error adding ticket communication:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId)
      .populate('assignedTo', 'name email')
      .populate('assignedById', 'name')
      .populate('queryId')
      .populate('resolvedBy', 'name');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket fetched successfully",
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getUserTickets,
  updateTicketStatus,
  addTicketCommunication,
  getTicketById,
};

const Query = require("../../../Schema/query.schema/query.model");
const Ticket = require("../../../Schema/ticket.Schema/ticket.modal");
 // If you need to update query status as well

// Get all tickets assigned to a specific user
const getTicketsAssignedToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch tickets assigned to this user, populated with query details
    const tickets = await Ticket.find({ assignedTo: userId })
      .populate('queryId', 'queryType description photos clientName status createdAt') // Populate query details
      .sort({ createdAt: -1 });

    console.log(`Found ${tickets.length} tickets for user ${userId}`);

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching assigned tickets:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching assigned tickets",
    });
  }
};

// Get specific ticket details by ID
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId)
      .populate('queryId', 'queryType description photos clientName client email createdAt communications')
      .populate('assignedTo', 'name email')
      .populate('communications.sender', 'name role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching ticket",
    });
  }
};

// // Update ticket status
// const updateTicketStatus = async (req, res) => {
//   try {
//     const { ticketId } = req.params;
//     const { status, updatedBy } = req.body;

//     // Validate status
//     const validStatuses = ["assigned", "in-progress", "resolved", "closed"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status value",
//       });
//     }

//     const ticket = await Ticket.findByIdAndUpdate(
//       ticketId,
//       { 
//         status,
//         ...(status === "resolved" && { 
//           resolvedAt: new Date(),
//           resolvedBy: updatedBy 
//         }),
//         ...(status === "closed" && { 
//           closedAt: new Date() 
//         })
//       },
//       { new: true, runValidators: true }
//     ).populate('queryId');

//     if (!ticket) {
//       return res.status(404).json({
//         success: false,
//         message: "Ticket not found",
//       });
//     }

//     // Optionally update the original query status as well
//     if (ticket.queryId) {
//       await Query.findByIdAndUpdate(
//         ticket.queryId._id,
//         { status: status === "resolved" || status === "closed" ? "closed" : "assigned" }
//       );
//     }

//     res.status(200).json({
//       success: true,
//       message: `Ticket status updated to ${status}`,
//       data: ticket,
//     });
//   } catch (error) {
//     console.error("Error updating ticket status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while updating ticket status",
//     });
//   }
// };

// Add communication to ticket
const addTicketCommunication = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { sender, senderName, senderRole, message, attachments = [] } = req.body;

    if (!message || !sender) {
      return res.status(400).json({
        success: false,
        message: "Message and sender are required",
      });
    }

    const newCommunication = {
      sender,
      senderName,
      senderRole,
      message,
      attachments,
      sentAt: new Date()
    };

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: { communications: newCommunication },
        $set: { updatedAt: new Date() }
      },
      { new: true, runValidators: true }
    ).populate('communications.sender', 'name role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Communication added successfully",
      data: ticket.communications,
    });
  } catch (error) {
    console.error("Error adding ticket communication:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding communication",
    });
  }
};

// Resolve ticket with resolution notes
const resolveTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { resolvedBy, resolvedByName, resolutionNotes } = req.body;

    if (!resolutionNotes) {
      return res.status(400).json({
        success: false,
        message: "Resolution notes are required",
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        status: "resolved",
        resolvedBy,
        resolvedByName,
        resolutionNotes,
        resolvedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('queryId');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Update the original query status to closed
    if (ticket.queryId) {
      await Query.findByIdAndUpdate(
        ticket.queryId._id,
        { 
          status: "closed",
          adminResponse: resolutionNotes // Optional: add resolution notes to query
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Ticket resolved successfully",
      data: ticket,
    });
  } catch (error) {
    console.error("Error resolving ticket:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resolving ticket",
    });
  }
};


// Unified status update for both queries and tickets
const updateStatus = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { status, updatedBy, updatedByName, resolutionNotes, message } = req.body;

    // Validate status based on entity type
    const validQueryStatuses = ["open", "assigned", "in-progress", "resolved", "closed"];
    const validTicketStatuses = ["assigned", "in-progress", "resolved", "closed"];
    
    if (entityType === 'query' && !validQueryStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value for query",
      });
    }
    
    if (entityType === 'ticket' && !validTicketStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value for ticket",
      });
    }

    let updatedEntity;
    let relatedEntity;

    if (entityType === 'query') {
      // Update query
      const updateData = {
        status,
        updatedAt: new Date()
      };

      // Add resolution data if status is resolved or closed
      if (status === "resolved" || status === "closed") {
        updateData.resolvedAt = new Date();
        if (updatedBy) updateData.resolvedBy = updatedBy;
        if (updatedByName) updateData.resolvedByName = updatedByName;
        if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
      }

      // Add communication if message is provided
      if (message) {
        const communication = {
          sender: updatedBy ? "assigned_user" : "admin",
          message: message,
          sentAt: new Date()
        };
        
        updateData.$push = { communications: communication };
      }

      updatedEntity = await Query.findByIdAndUpdate(
        entityId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedEntity) {
        return res.status(404).json({
          success: false,
          message: "Query not found",
        });
      }

      // Update related ticket if exists
      if (updatedEntity.ticketId) {
        const ticketUpdateData = {
          status: status === "open" ? "assigned" : status, // Map open status to assigned for tickets
          updatedAt: new Date()
        };

        if (status === "resolved" || status === "closed") {
          ticketUpdateData.resolvedAt = new Date();
          if (updatedBy) ticketUpdateData.resolvedBy = updatedBy;
          if (updatedByName) ticketUpdateData.resolvedByName = updatedByName;
          if (resolutionNotes) ticketUpdateData.resolutionNotes = resolutionNotes;
        }

        relatedEntity = await Ticket.findByIdAndUpdate(
          updatedEntity.ticketId,
          ticketUpdateData,
          { new: true, runValidators: true }
        );
      }

      // Create notification for client
      if (updatedEntity.clientId) {
        // await Notification.create({
        //   recipient: updatedEntity.clientId,
        //   recipientModel: "User",
        //   title: "Query Status Updated",
        //   message: `Your query status has been updated to "${status}"`,
        //   type: "status_update",
        //   relatedEntityType: "Query",
        //   relatedEntityId: updatedEntity._id,
        // });
      }

    } else if (entityType === 'ticket') {
      // Update ticket
      const updateData = {
        status,
        updatedAt: new Date()
      };

      if (status === "resolved" || status === "closed") {
        updateData.resolvedAt = new Date();
        if (updatedBy) updateData.resolvedBy = updatedBy;
        if (updatedByName) updateData.resolvedByName = updatedByName;
        if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
      }

      updatedEntity = await Ticket.findByIdAndUpdate(
        entityId,
        updateData,
        { new: true, runValidators: true }
      ).populate('queryId');

      if (!updatedEntity) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      // Update related query
      if (updatedEntity.queryId) {
        const queryUpdateData = {
          status: status,
          updatedAt: new Date()
        };

        if (status === "resolved" || status === "closed") {
          queryUpdateData.resolvedAt = new Date();
          if (updatedBy) queryUpdateData.resolvedBy = updatedBy;
          if (updatedByName) queryUpdateData.resolvedByName = updatedByName;
          if (resolutionNotes) queryUpdateData.resolutionNotes = resolutionNotes;
        }

        relatedEntity = await Query.findByIdAndUpdate(
          updatedEntity.queryId._id,
          queryUpdateData,
          { new: true, runValidators: true }
        );

        // Create notification for client
        if (relatedEntity && relatedEntity.clientId) {
          // await Notification.create({
          //   recipient: relatedEntity.clientId,
          //   recipientModel: "User",
          //   title: "Ticket Status Updated",
          //   message: `Your ticket status has been updated to "${status}"`,
          //   type: "status_update",
          //   relatedEntityType: "Ticket",
          //   relatedEntityId: updatedEntity._id,
          // });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid entity type. Use 'query' or 'ticket'",
      });
    }

    res.status(200).json({
      success: true,
      message: `${entityType} status updated to ${status}`,
      data: {
        updatedEntity,
        relatedEntity
      },
    });

  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating status",
    });
  }
};


module.exports = {
  getTicketsAssignedToUser,
  getTicketById,
  updateStatus,
  addTicketCommunication,
  resolveTicket
};







// Get status history for an entity
// const getStatusHistory = async (req, res) => {
//   try {
//     const { entityType, entityId } = req.params;

//     let entity;
//     if (entityType === 'query') {
//       entity = await Query.findById(entityId).select('status communications updatedAt');
//     } else if (entityType === 'ticket') {
//       entity = await Ticket.findById(entityId).select('status communications updatedAt');
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid entity type",
//       });
//     }

//     if (!entity) {
//       return res.status(404).json({
//         success: false,
//         message: `${entityType} not found`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: entity,
//     });

//   } catch (error) {
//     console.error("Error fetching status history:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching status history",
//     });
//   }
// };


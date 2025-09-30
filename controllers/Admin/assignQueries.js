const Query = require("../../Schema/query.schema/query.model");

const assignQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { 
      assignedTo, 
      assignedToName, 
      assignedRole, 
      assignmentNotes,
      status = "assigned"
    } = req.body;

    console.log("queryId",queryId)
    console.log('assignedTo', 
      'assignedToName', 
      'assignedRole', 
      'assignmentNotes',assignedTo, 
      assignedToName, 
      assignedRole, 
      assignmentNotes)

    // Validate required fields
    if (!assignedTo || !assignedToName || !assignedRole) {
      return res.status(400).json({
        success: false,
        message: "Assigned user details are required",
      });
    }

    // Find the query
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    // Check if query is already assigned
    if (query.assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Query is already assigned to another user",
      });
    }

    // Update query with assignment details
    query.assignedTo = assignedTo;
    query.assignedToName = assignedToName;
    query.assignedRole = assignedRole;
    query.assignmentNotes = assignmentNotes;
    query.assignedAt = new Date();
    query.status = status;

    // // Add assignment notification to communications
    const assignmentCommunication = {
      sender: "admin",
      senderName: "Admin",
      message: `Query assigned to ${assignedToName} (${assignedRole})${assignmentNotes ? `. Notes: ${assignmentNotes}` : ''}`,
      sentAt: new Date(),
    };

    query.communications = Array.isArray(query.communications)
      ? [...query.communications, assignmentCommunication]
      : [assignmentCommunication];

    await query.save();

    // // Create notification for the assigned user
    // try {
    //   const Notification = require("./Notification"); // Adjust path as needed
      
    //   await Notification.create({
    //     recipient: assignedTo,
    //     recipientModel: "User",
    //     title: "New Query Assigned",
    //     message: `You have been assigned a new query: "${query.queryType}" from ${query.client}`,
    //     type: "assignment",
    //     relatedEntityType: "Query",
    //     relatedEntityId: query._id,
    //     isRead: false,
    //   });
    // } catch (notificationError) {
    //   console.error("Error creating notification:", notificationError.message);
    //   // Continue even if notification fails
    // }

    res.status(200).json({
      success: true,
      data: query,
      message: "Query assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning query:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while assigning query",
    });
  }
};


module.exports=assignQuery;
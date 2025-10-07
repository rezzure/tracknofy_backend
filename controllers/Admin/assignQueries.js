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

    console.log("queryId", queryId);
    console.log('assignedTo', assignedTo, 'assignedToName', assignedToName, 'assignedRole', assignedRole, 'assignmentNotes', assignmentNotes);

    // Validate required fields
    if (!assignedTo || !assignedToName || !assignedRole) {
      return res.status(400).json({
        success: false,
        message: "Assigned user details are required",
      });
    }

    // Validate queryId
    if (!queryId || queryId === '[object Object]') {
      return res.status(400).json({
        success: false,
        message: "Invalid query ID",
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

    // Add assignment notification to communications
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

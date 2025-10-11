const Design = require("../../Schema/designApproval.schema/designApproval.model");

const updateDesignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, updatedBy, userRole } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: "Status is required" 
      });
    }

    // Validate status value
    const validStatuses = ['pending', 'sent', 'approved', 'review'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Prepare update data
    const updateData = {
      status: status,
      updatedAt: new Date(),
      workflow_remark: remarks || ""
    };

    // Disable chat when design is approved
    if (status === 'approved') {
      updateData.isChatEnabled = false;
    }

    // Add remarks as comment if provided
    if (remarks && remarks.trim()) {
      updateData.$push = {
        comments: {
          text: remarks.trim(),
          user: updatedBy || "Unknown",
          userRole: userRole || "Unknown",
          date: new Date()
        }
      };
    }

    // Update the design
    const design = await Design.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return updated document
    );

    if (!design) {
      return res.status(404).json({ 
        success: false, 
        message: "Design not found" 
      });
    }

    res.json({ 
      success: true, 
      data: design, 
      message: `Design status updated to ${status}` 
    });
  } catch (error) {
    console.error('Error updating design status:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error: " + error.message 
    });
  }
};

module.exports = updateDesignStatus;
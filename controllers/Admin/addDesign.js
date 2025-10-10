// controllers/Admin/addDesign.js
const Design = require("../../Schema/designApproval.schema/designApproval.model");
const Admin = require("../../Schema/admin.schema/admine.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

const addDesign = async (req, res) => {
  try {
    const email = req.query.email;

    let user = await Admin.findOne({ email });
    let userModel = "Admin";

    if (!user) {
      user = await Supervisor.findOne({ email });
      userModel = "User";
    }
    
    if (!user) {
      return res.status(404).send({ 
        success: false, 
        message: "User not found with email: " + email 
      });
    }
    
    const {
      siteId,
      siteName,
      floorName,
      scopeOfWork,
      workItem,
      workType,
      imageType,
      title,
      description,
      // project,
      createdBy,
    } = req.body;

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Validate required fields
    if (!siteId || !siteName || !floorName || !scopeOfWork || !workItem || !workType || 
        !imageType || !title || !req.file) {
      return res.status(400).send({
        success: false,
        message: "All required fields must be provided including file"
      });
    }

    // Check if file was uploaded
    let imageData = null;
    if (req.file) {
      // Store the relative path that can be served via /uploads
      const relativePath = `uploads/${req.file.filename}`;
      
      imageData = {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        destination: req.file.destination,
        filename: req.file.filename,
        path: relativePath,
        size: req.file.size / 1024 // size in KB
      };
    }

    let designData = {
      siteId: siteId,
      siteName: siteName,
      floorName: floorName,
      scopeOfWork: scopeOfWork,
      workItem: workItem,
      workType: workType,
      imageType: imageType,
      title: title,
      description: description,
      // project: project || title,
      image: imageData,
      fileName: req.file.originalname,
      fileType: req.file.mimetype.startsWith('image/') ? 'image' : 'pdf',
      createdBy: user._id,
      createdByModel: userModel, 
      createdByName: user.name || user.userName || createdBy, // Store the name
      createdByEmail: user.email, // Store the email
      status: "pending",
      versionNumber: 1,
      workflow_remark: "",
      comments: [],
      isChatEnabled: true
    }

    let data = await Design.create(designData);
    
    return res.status(200).send({
      success: true,
      message: "Design uploaded successfully",
      data: data
    });
  }
  catch (err) {
    console.error("Error uploading design:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error: " + err.message
    });
  }
}

// Update design status with workflow remarks and chat control
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

// Add comment to design
const addComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, user, userRole } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required"
      });
    }

    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found"
      });
    }

    // Check if chat is enabled
    if (!design.isChatEnabled) {
      return res.status(400).json({
        success: false,
        message: "Chat is disabled for this design as it has been approved"
      });
    }

    const newComment = {
      text: text.trim(),
      user: user || "Unknown",
      userRole: userRole || "Unknown",
      date: new Date()
    };

    design.comments.push(newComment);
    await design.save();

    res.json({
      success: true,
      data: design,
      message: "Comment added successfully"
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

module.exports = {
  addDesign,
  updateDesignStatus,
  addComments
};
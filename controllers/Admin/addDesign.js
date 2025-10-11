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

// Send design to client
const sendDesignToClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminName, adminEmail } = req.body;

    const design = await Design.findByIdAndUpdate(
      id,
      {
        status: 'sent',
        updatedAt: new Date(),
        isChatEnabled: true, // Enable chat when sent to client
        $push: {
          comments: {
            text: 'Design sent to client for review',
            user: adminName || 'Admin',
            userRole: 'Admin',
            date: new Date()
          }
        }
      },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    res.json({
      success: true,
      data: design,
      message: 'Design sent to client successfully'
    });
  } catch (error) {
    console.error('Error sending design to client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

module.exports = {
  addDesign,
  addComments,
  sendDesignToClient
};
// controllers/Admin/addDesign.js
const Design = require("../../Schema/designApproval.schema/designApproval.model");
const Admin = require("../../Schema/admin.schema/admine.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

// controllers/Admin/addDesign.js
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
    } = req.body;

    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files); // Changed to req.files

    // Validate required fields
    if (!siteId || !siteName || !floorName || !scopeOfWork || !workItem || !workType || 
        !imageType || !title || !req.files || req.files.length === 0) { // Changed validation
      return res.status(400).send({
        success: false,
        message: "All required fields must be provided including files"
      });
    }

    // Process multiple files
    const imagesData = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const relativePath = `uploads/${file.filename}`;
        
        imagesData.push({
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          destination: file.destination,
          filename: file.filename,
          path: relativePath,
          size: file.size / 1024 // size in KB
        });
      });
    }

    // Use first file for fileName and fileType (for backward compatibility)
    const firstFile = req.files[0];

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
      images: imagesData, // Store array of images
      fileName: firstFile.originalname,
      fileType: firstFile.mimetype.startsWith('image/') ? 'image' : 'pdf',
      createdBy: user._id,
      createdByModel: userModel, 
      createdByName: user.name || user.userName, 
      createdByEmail: user.email,
      status: "pending",
      versionNumber: 1,
      workflow_remark: "",
      comments: [],
      isChatEnabled: true
    }

    let data = await Design.create(designData);
    
    return res.status(200).send({
      success: true,
      message: "Design uploaded successfully with " + imagesData.length + " files",
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
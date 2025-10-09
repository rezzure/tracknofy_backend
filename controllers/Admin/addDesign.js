const Design = require("../../Schema/designApproval.schema/designApproval.model");
const Admin = require("../../Schema/admin.schema/admine.model"); // Add this import
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model"); // Add User import if needed

const addDesign = async (req, res) => {
  try {
    const email = req.query.email;
    
    console.log("Looking for user with email:", email);
    
    // First try to find in Admin collection
    let user = await Admin.findOne({ email });
    let userModel = "Admin";

    // If not found in Admin, try User collection
    if (!user) {
      user = await Supervisor.findOne({ email });
      userModel = "User";
    }

    console.log("User found:", user);
    
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
      project,
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
        size: req.file.size
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
      project: project || title,
      image: imageData,
      fileName: req.file.originalname,
      fileType: req.file.mimetype.startsWith('image/') ? 'image' : 'pdf',
      createdBy: user._id,
      createdByModel: userModel, 
      createdByName: user.name || user.userName || createdBy, // Store the name
      createdByEmail: user.email, // Store the email
      status: "pending",
      versionNumber: 1
    }

    console.log("Creating design with data:", designData);

    let data = await Design.create(designData);
    
    console.log("Design created successfully:", data);
    
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

module.exports = addDesign;
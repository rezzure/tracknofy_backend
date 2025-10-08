const Design = require("../../Schema/designApproval.schema/designApproval.model");

const addDesign = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    
    const {
      siteId,
      siteName,
      scopeOfWork,
      workItem,
      workType,
      imageType,
      title,
      description,
      project,
      createdBy
    } = req.body;

    // Validate required fields
    if (!siteId || !siteName || !scopeOfWork || !workItem || !workType || 
        !imageType || !title || !req.file) {
      return res.status(400).send({
        success: false,
        message: "All required fields must be provided including file"
      });
    }

    // Check if file was uploaded
    let imageData = null;
    if (req.file) {
      console.log("=== FILE UPLOAD DEBUG ===");
      console.log("File destination:", req.file.destination);
      console.log("File path:", req.file.path);
      console.log("File filename:", req.file.filename);
      console.log("=== END DEBUG ===");
      
      // Store the relative path that can be served via /uploads
      const relativePath = `uploads/${req.file.filename}`;
      
      imageData = {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        destination: req.file.destination,
        filename: req.file.filename,
        path: relativePath, // Store the relative path for serving
        size: req.file.size
      };
    }

    let designData = {
      siteId: siteId,
      siteName: siteName,
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
      createdBy: createdBy,
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
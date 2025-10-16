// controllers/Admin/addDesign.js
// const Design = require("../../Schema/designApproval.schema/designApproval.model");
// const Admin = require("../../Schema/admin.schema/admine.model");
// const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

// // controllers/Admin/addDesign.js
// const addDesign = async (req, res) => {
//   try {
//     const email = req.query.email;

//     let user = await Admin.findOne({ email });
//     let userModel = "Admin";

//     if (!user) {
//       user = await Supervisor.findOne({ email });
//       userModel = "User";
//     }
    
//     if (!user) {
//       return res.status(404).send({ 
//         success: false, 
//         message: "User not found with email: " + email 
//       });
//     }
    
//     const {
//       siteId,
//       siteName,
//       floorName,
//       scopeOfWork,
//       workItem,
//       workType,
//       imageType,
//       title,
//       description,
//     } = req.body;

//     console.log("Request body:", req.body);
//     console.log("Uploaded files:", req.files); // Changed to req.files

//     // Validate required fields
//     if (!title || !req.files || req.files.length === 0) { // Changed validation
//       return res.status(400).send({
//         success: false,
//         message: "All required fields must be provided including files"
//       });
//     }

//     // Process multiple files
//     const imagesData = [];
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         const relativePath = `uploads/${file.filename}`;
        
//         imagesData.push({
//           fieldname: file.fieldname,
//           originalname: file.originalname,
//           mimetype: file.mimetype,
//           destination: file.destination,
//           filename: file.filename,
//           path: relativePath,
//           size: file.size / 1024 // size in KB
//         });
//       });
//     }

//     // Use first file for fileName and fileType (for backward compatibility)
//     const firstFile = req.files[0];

//     let designData = {
//       siteId: siteId,
//       siteName: siteName,
//       floorName: floorName,
//       scopeOfWork: scopeOfWork,
//       workItem: workItem,
//       workType: workType,
//       imageType: imageType,
//       title: title,
//       description: description,
//       images: imagesData, // Store array of images
//       fileName: firstFile.originalname,
//       fileType: firstFile.mimetype.startsWith('image/') ? 'image' : 'pdf',
//       createdBy: user._id,
//       createdByModel: userModel, 
//       createdByName: user.name || user.userName, 
//       createdByEmail: user.email,
//       status: "pending",
//       versionNumber: 1,
//       workflow_remark: "",
//       comments: [],
//       isChatEnabled: true
//     }

//     let data = await Design.create(designData);
    
//     return res.status(200).send({
//       success: true,
//       message: "Design uploaded successfully with " + imagesData.length + " files",
//       data: data
//     });
//   }
//   catch (err) {
//     console.error("Error uploading design:", err);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error: " + err.message
//     });
//   }
// }

// // Add comment to design
// const addComments = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { text, user, userRole } = req.body;

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Comment text is required"
//       });
//     }

//     const design = await Design.findById(id);
//     if (!design) {
//       return res.status(404).json({
//         success: false,
//         message: "Design not found"
//       });
//     }

//     // Check if chat is enabled
//     if (!design.isChatEnabled) {
//       return res.status(400).json({
//         success: false,
//         message: "Chat is disabled for this design as it has been approved"
//       });
//     }

//     const newComment = {
//       text: text.trim(),
//       user: user || "Unknown",
//       userRole: userRole || "Unknown",
//       date: new Date()
//     };

//     design.comments.push(newComment);
//     await design.save();

//     res.json({
//       success: true,
//       data: design,
//       message: "Comment added successfully"
//     });
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message
//     });
//   }
// };

// // Send design to client
// const sendDesignToClient = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { adminName, adminEmail } = req.body;

//     const design = await Design.findByIdAndUpdate(
//       id,
//       {
//         status: 'sent',
//         updatedAt: new Date(),
//         isChatEnabled: true, // Enable chat when sent to client
//         $push: {
//           comments: {
//             text: 'Design sent to client for review',
//             user: adminName || 'Admin',
//             userRole: 'Admin',
//             date: new Date()
//           }
//         }
//       },
//       { new: true }
//     ).populate('createdBy', 'name email');

//     if (!design) {
//       return res.status(404).json({
//         success: false,
//         message: 'Design not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: design,
//       message: 'Design sent to client successfully'
//     });
//   } catch (error) {
//     console.error('Error sending design to client:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// module.exports = {
//   addDesign,
//   addComments,
//   sendDesignToClient
// };



// New Controller



const Design = require("../../Schema/designApproval.schema/designApproval.model");
const Admin = require("../../Schema/admin.schema/admine.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");
const { default: mongoose } = require("mongoose");

// controllers/Admin/addDesign.js
// Update the existing addDesign function to start from version 0
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
    console.log("Uploaded files:", req.files);

    // Validate required fields
    if (!title || !req.files || req.files.length === 0) {
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
          size: file.size / 1024
        });
      });
    }

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
      images: imagesData,
      fileName: firstFile.originalname,
      fileType: firstFile.mimetype.startsWith('image/') ? 'image' : 'pdf',
      createdBy: user._id,
      createdByModel: userModel, 
      createdByName: user.name || user.userName, 
      createdByEmail: user.email,
      status: "pending",
      versionNumber: 0, // Start from version 0
      versionChanges: "Initial version",
      workflow_remark: "",
      comments: [],
      isChatEnabled: true,
      parentVersion: null, // No parent for first version
      isLatestVersion: true
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

// Create new version of a design - UPDATED
const createNewVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email;
    const { versionChanges } = req.body;

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

    // Find the original design
    const originalDesign = await Design.findById(id);
    if (!originalDesign) {
      return res.status(404).json({
        success: false,
        message: "Original design not found"
      });
    }

    // Mark original design as not latest
    originalDesign.isLatestVersion = false;
    await originalDesign.save();

    // Create new version based on original design
    const newVersionData = {
      ...originalDesign.toObject(),
      _id: new mongoose.Types.ObjectId(),
      versionNumber: originalDesign.versionNumber + 1,
      versionChanges: versionChanges || "",
      parentVersion: originalDesign._id,
      isLatestVersion: true,
      status: "sent", // Reset status to "sent" for new version
      comments: [], // Start with empty comments for new version
      isChatEnabled: true, // ENABLE CHAT FOR NEW VERSION
      workflow_remark: "", // Reset workflow remarks
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Remove inherited fields that should be unique to this version
    delete newVersionData.comments;
    delete newVersionData.workflow_remark;

    const newVersion = await Design.create(newVersionData);

    // Add a comment about the version creation
    newVersion.comments.push({
      text: `New version V${newVersion.versionNumber} created. Changes: ${versionChanges}`,
      user: user.name || user.userName,
      userRole: userModel,
      date: new Date()
    });

    await newVersion.save();

    res.status(201).json({
      success: true,
      message: `New version V${newVersion.versionNumber} created successfully`,
      data: newVersion
    });
  } catch (error) {
    console.error("Error creating new version:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Get all versions of a design
const getDesignVersions = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching versions for design:", id); // Debug log

    // Find the current design
    const currentDesign = await Design.findById(id);
    if (!currentDesign) {
      return res.status(404).json({
        success: false,
        message: "Design not found"
      });
    }

    // Find the root design (the very first version)
    let rootDesignId = currentDesign.parentVersion || currentDesign._id;
    console.log("Root design ID:", rootDesignId); // Debug log
    
    // Get all versions in the version chain
    const versions = await Design.find({
      $or: [
        { _id: rootDesignId },
        { parentVersion: rootDesignId }
      ]
    })
    .sort({ versionNumber: 1 }) // Sort by version number ascending
    .select('-__v') // Exclude version field
    .lean(); // Convert to plain objects for better performance

    console.log("Found versions:", versions.length); // Debug log

    res.json({
      success: true,
      data: versions,
      message: "Design versions retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching design versions:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Update routes in your backend
module.exports = {
  addDesign,
  addComments,
  sendDesignToClient,
  createNewVersion, // Add this
  getDesignVersions // Add this
};
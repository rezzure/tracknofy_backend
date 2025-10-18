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
const mongoose = require("mongoose");

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
    const { versionChanges } = req.body;

    // Find the current design
    const currentDesign = await Design.findById(id);
    
    if (!currentDesign) {
      return res.status(404).json({ success: false, message: "Design not found" });
    }

    // Save current version to history
    const versionToSave = {
      versionNumber: currentDesign.versionNumber,
      images: currentDesign.images,
      fileName: currentDesign.fileName,
      fileType: currentDesign.fileType,
      versionChanges: currentDesign.versionChanges,
      status: currentDesign.status,
      comments: currentDesign.comments,
      isChatEnabled: currentDesign.isChatEnabled,
      createdAt: currentDesign.createdAt,
      updatedAt: currentDesign.updatedAt,
      createdBy: currentDesign.createdBy,
      createdByModel: currentDesign.createdByModel
    };

    // Update the design with new version
    const updatedDesign = await Design.findByIdAndUpdate(
      id,
      {
        $push: { versionHistory: versionToSave },
        $set: {
          versionNumber: currentDesign.versionNumber + 1,
          versionChanges: versionChanges || "",
          status: "pending", // Reset status for new version
          comments: [], // Reset comments for new version
          images: req.files ? processFiles(req.files) : currentDesign.images, // New files or keep current
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedDesign,
      message: `New version V${updatedDesign.versionNumber} created successfully`
    });
  } catch (error) {
    console.error("Error creating new version:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all versions of a design
// const getDesignVersions = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("Fetching versions for design:", id); // Debug log

//     // Find the current design
//     const currentDesign = await Design.findById(id);
//     if (!currentDesign) {
//       return res.status(404).json({
//         success: false,
//         message: "Design not found"
//       });
//     }

//     // Find the root design (the very first version)
//     let rootDesignId = currentDesign.parentVersion || currentDesign._id;
//     console.log("Root design ID:", rootDesignId); // Debug log
    
//     // Get all versions in the version chain
//     const versions = await Design.find({
//       $or: [
//         { _id: rootDesignId },
//         { parentVersion: rootDesignId }
//       ]
//     })
//     .sort({ versionNumber: 1 }) // Sort by version number ascending
//     .select('-__v') // Exclude version field
//     .lean(); // Convert to plain objects for better performance

//     console.log("Found versions:", versions.length); // Debug log

//     res.json({
//       success: true,
//       data: versions,
//       message: "Design versions retrieved successfully"
//     });
//   } catch (error) {
//     console.error("Error fetching design versions:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message
//     });
//   }
// };

// In your backend - Fix the switchDesignVersion function
const switchDesignVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { versionNumber } = req.body;

    console.log("Switching to version:", versionNumber, "for design:", id);

    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found"
      });
    }

    let versionData;

    if (parseInt(versionNumber) === design.versionNumber) {
      // Current version
      versionData = {
        _id: design._id,
        versionNumber: design.versionNumber,
        images: design.images || [],
        fileName: design.fileName,
        fileType: design.fileType,
        versionChanges: design.versionChanges || "",
        status: design.status,
        comments: design.comments || [],
        isChatEnabled: design.isChatEnabled !== false,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        createdBy: design.createdBy,
        createdByModel: design.createdByModel,
        isLatestVersion: true,
        // Design metadata
        siteId: design.siteId,
        siteName: design.siteName,
        floorName: design.floorName,
        scopeOfWork: design.scopeOfWork,
        workItem: design.workItem,
        workType: design.workType,
        imageType: design.imageType,
        title: design.title,
        description: design.description,
        workflow_remark: design.workflow_remark || ""
      };
    } else {
      // Find in version history
      const versionHistory = design.versionHistory || [];
      const foundVersion = versionHistory.find(
        v => v.versionNumber === parseInt(versionNumber)
      );
      
      if (!foundVersion) {
        return res.status(404).json({
          success: false,
          message: `Version V${versionNumber} not found in history`
        });
      }

      versionData = {
        _id: design._id,
        versionNumber: foundVersion.versionNumber,
        images: foundVersion.images || [],
        fileName: foundVersion.fileName,
        fileType: foundVersion.fileType,
        versionChanges: foundVersion.versionChanges || "",
        status: foundVersion.status,
        comments: foundVersion.comments || [],
        isChatEnabled: foundVersion.isChatEnabled !== false,
        createdAt: foundVersion.createdAt,
        updatedAt: foundVersion.updatedAt,
        createdBy: foundVersion.createdBy,
        createdByModel: foundVersion.createdByModel,
        isLatestVersion: false,
        // Design metadata
        siteId: design.siteId,
        siteName: design.siteName,
        floorName: design.floorName,
        scopeOfWork: design.scopeOfWork,
        workItem: design.workItem,
        workType: design.workType,
        imageType: design.imageType,
        title: design.title,
        description: design.description,
        workflow_remark: foundVersion.workflow_remark || ""
      };
    }

    console.log("Returning version data for V" + versionNumber + ":", {
      images: versionData.images?.length,
      comments: versionData.comments?.length,
      status: versionData.status
    });

    res.json({
      success: true,
      data: versionData,
      message: `Switched to version V${versionNumber}`
    });
  } catch (error) {
    console.error("Error switching version:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
}

// Update routes in your backend
module.exports = {
  addDesign,
  addComments,
  sendDesignToClient,
  createNewVersion, // Add this
  // getDesignVersions, // Add this
  switchDesignVersion
};
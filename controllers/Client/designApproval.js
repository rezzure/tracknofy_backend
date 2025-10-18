// const Design = require("../../Schema/designApproval.schema/designApproval.model");
// const Client = require("../../Schema/client.schema/client.model");

// // Get designs for client dashboard
// const getClientDesigns = async (req, res) => {
//   try {
//     const clientEmail = req.query.email || req.user?.email;
    
//     if (!clientEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Client email is required"
//       });
//     }

//     // Find client by email
//     const client = await Client.findOne({ email: clientEmail });
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: "Client not found"
//       });
//     }

//     // Get designs for this client - only review and approved status
//     const designs = await Design.find({
//       status: { $in: ['sent', 'review', 'approved'] }
//     })
//     .sort({ createdAt: -1 })
//     .populate('createdBy', 'name email')
//     .lean();

//     console.log(`Found ${designs.length} designs for client ${client.name}`);

//     // Format the response and handle undefined values for search
//     const formattedDesigns = designs.map(design => ({
//       _id: design._id,
//       title: design.title || '',
//       project: design.project || '',
//       description: design.description || '',
//       siteName: design.siteName || '',
//       floorName: design.floorName || '',
//       scopeOfWork: design.scopeOfWork || '',
//       workItem: design.workItem || '',
//       workType: design.workType || '',
//       imageType: design.imageType || '',
//       images: design.images || [],
//       fileName: design.fileName || '',
//       fileType: design.fileType || '',
//       status: design.status || 'review',
//       versionNumber: design.versionNumber || 1,
//       createdByName: design.createdBy?.name || design.createdByName || 'Unknown',
//       createdByEmail: design.createdBy?.email || '',
//       createdAt: design.createdAt,
//       updatedAt: design.updatedAt,
//       comments: design.comments || [],
//       workflow_remark: design.workflow_remark || '',
//       isChatEnabled: design.isChatEnabled !== false
//     }));

//     res.json({
//       success: true,
//       data: formattedDesigns,
//       client: {
//         name: client.name,
//         email: client.email,
//         company: client.company
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching client designs:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Handle client actions (only approve and request changes - NO REJECT)
// const handleClientAction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { action, feedback, clientName, clientEmail } = req.body;

//     // Validate action - ONLY approve and changes allowed
//     const validActions = ['approved', 'changes'];
//     if (!validActions.includes(action)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid action. Must be one of: approved, changes'
//       });
//     }

//     // Verify client exists
//     const client = await Client.findOne({ email: clientEmail });
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: 'Client not found'
//       });
//     }

//     // Map action to status
//     const statusMap = {
//       approved: 'approved',
//       changes: 'review' // When client requests changes, set status to review
//     };

//     const newStatus = statusMap[action];

//     // Prepare update data
//     const updateData = {
//       status: newStatus,
//       updatedAt: new Date(),
//       clientFeedback: feedback || ''
//     };

//     // Disable chat when design is approved
//     if (action === 'approved') {
//       updateData.isChatEnabled = false;
//     }

//     // Add client feedback as comment
//     if (feedback && feedback.trim()) {
//       updateData.$push = {
//         comments: {
//           text: feedback.trim(),
//           user: clientName || client.name,
//           userRole: 'Client',
//           date: new Date()
//         }
//       };
//     }

//     // Update the design
//     const design = await Design.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     ).populate('createdBy', 'name email');

//     if (!design) {
//       return res.status(404).json({
//         success: false,
//         message: 'Design not found'
//       });
//     }

//     // Log the action
//     console.log(`Client ${clientName} (${clientEmail}) ${action} design ${id}`);

//     res.json({
//       success: true,
//       data: design,
//       message: action === 'approved' ? 'Design approved successfully' : 'Changes requested successfully'
//     });
//   } catch (error) {
//     console.error('Error handling client action:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error: ' + error.message
//     });
//   }
// };

// // Add comment to design (client side)
// const addClientComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { text, clientName, clientEmail } = req.body;

//     if (!text || !text.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Comment text is required"
//       });
//     }

//     // Verify client exists
//     const client = await Client.findOne({ email: clientEmail });
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: "Client not found"
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
//       user: clientName || client.name,
//       userRole: 'Client',
//       date: new Date()
//     };

//     design.comments.push(newComment);
//     await design.save();

//     // Populate the response
//     await design.populate('createdBy', 'name email');

//     res.json({
//       success: true,
//       data: design,
//       message: "Comment added successfully"
//     });
//   } catch (error) {
//     console.error('Error adding client comment:', error);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message
//     });
//   }
// };

// // Get design details for client
// const getClientDesignDetails = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const clientEmail = req.query.email;

//     // Verify client exists
//     const client = await Client.findOne({ email: clientEmail });
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: "Client not found"
//       });
//     }

//     const design = await Design.findById(id)
//       .populate('createdBy', 'name email')
//       .lean();

//     if (!design) {
//       return res.status(404).json({
//         success: false,
//         message: "Design not found"
//       });
//     }

//     // Format the response
//     const designDetails = {
//       ...design,
//       createdByName: design.createdBy?.name || design.createdByName || 'Unknown',
//       createdByEmail: design.createdBy?.email || '',
//       canComment: design.isChatEnabled !== false
//     };

//     res.json({
//       success: true,
//       data: designDetails
//     });
//   } catch (error) {
//     console.error('Error fetching client design details:', error);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message
//     });
//   }
// };

// // Get client statistics - only review and approved
// const getClientStats = async (req, res) => {
//   try {
//     const clientEmail = req.query.email;

//     // Verify client exists
//     const client = await Client.findOne({ email: clientEmail });
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: "Client not found"
//       });
//     }

//     const stats = await Design.aggregate([
//       {
//         $match: {
//           status: { $in: ['review', 'approved'] }
//         }
//       },
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const formattedStats = {
//       total: 0,
//       review: 0,
//       approved: 0
//     };

//     stats.forEach(stat => {
//       formattedStats.total += stat.count;
//       if (stat._id === 'review') {
//         formattedStats.review += stat.count;
//       } else if (stat._id === 'approved') {
//         formattedStats.approved += stat.count;
//       }
//     });

//     res.json({
//       success: true,
//       data: {
//         stats: formattedStats,
//         client: {
//           name: client.name,
//           email: client.email,
//           company: client.company
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching client stats:', error);
//     res.status(500).json({
//       success: false,
//       message: "Server error: " + error.message
//     });
//   }
// };

// module.exports = {
//   getClientDesigns,
//   handleClientAction,
//   addClientComment,
//   getClientDesignDetails,
//   getClientStats
// };


// New Controller ------


const Design = require("../../Schema/designApproval.schema/designApproval.model");
const Client = require("../../Schema/client.schema/client.model");

// Get designs for client dashboard
const getClientDesigns = async (req, res) => {
  try {
    const clientEmail = req.query.email || req.user?.email;
    
    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        message: "Client email is required"
      });
    }

    // Find client by email
    const client = await Client.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    // Get designs for this client - only review and approved status
    const designs = await Design.find({
      status: { $in: ['sent', 'review', 'approved'] }
    })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email')
    .lean();

    console.log(`Found ${designs.length} designs for client ${client.name}`);

    // Format the response and handle undefined values for search
    const formattedDesigns = designs.map(design => ({
      _id: design._id,
      title: design.title || '',
      project: design.project || '',
      description: design.description || '',
      siteName: design.siteName || '',
      floorName: design.floorName || '',
      scopeOfWork: design.scopeOfWork || '',
      workItem: design.workItem || '',
      workType: design.workType || '',
      imageType: design.imageType || '',
      images: design.images || [],
      fileName: design.fileName || '',
      fileType: design.fileType || '',
      status: design.status || 'review',
      versionNumber: design.versionNumber || 0,
      createdByName: design.createdBy?.name || design.createdByName || 'Unknown',
      createdByEmail: design.createdBy?.email || '',
      createdAt: design.createdAt,
      updatedAt: design.updatedAt,
      comments: design.comments || [],
      workflow_remark: design.workflow_remark || '',
      isChatEnabled: design.isChatEnabled !== false
    }));

    res.json({
      success: true,
      data: formattedDesigns,
      client: {
        name: client.name,
        email: client.email,
        company: client.company
      }
    });
  } catch (error) {
    console.error('Error fetching client designs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Handle client actions (only approve and request changes - NO REJECT)
const handleClientAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, feedback, clientName, clientEmail } = req.body;

    // Validate action - ONLY approve and changes allowed
    const validActions = ['approved', 'changes'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be one of: approved, changes'
      });
    }

    // Verify client exists
    const client = await Client.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Map action to status
    const statusMap = {
      approved: 'approved',
      changes: 'review' // When client requests changes, set status to review
    };

    const newStatus = statusMap[action];

    // Prepare update data
    const updateData = {
      status: newStatus,
      updatedAt: new Date(),
      clientFeedback: feedback || ''
    };

    // Disable chat when design is approved
    if (action === 'approved') {
      updateData.isChatEnabled = false;
    }

    // Add client feedback as comment
    if (feedback && feedback.trim()) {
      updateData.$push = {
        comments: {
          text: feedback.trim(),
          user: clientName || client.name,
          userRole: 'Client',
          date: new Date()
        }
      };
    }

    // Update the design
    const design = await Design.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found'
      });
    }

    // Log the action
    console.log(`Client ${clientName} (${clientEmail}) ${action} design ${id}`);

    res.json({
      success: true,
      data: design,
      message: action === 'approved' ? 'Design approved successfully' : 'Changes requested successfully'
    });
  } catch (error) {
    console.error('Error handling client action:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Add comment to design (client side)
const addClientComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, clientName, clientEmail } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required"
      });
    }

    // Verify client exists
    const client = await Client.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
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
      user: clientName || client.name,
      userRole: 'Client',
      date: new Date()
    };

    design.comments.push(newComment);
    await design.save();

    // Populate the response
    await design.populate('createdBy', 'name email');

    res.json({
      success: true,
      data: design,
      message: "Comment added successfully"
    });
  } catch (error) {
    console.error('Error adding client comment:', error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Get design details for client
const getClientDesignDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const clientEmail = req.query.email;

    // Verify client exists
    const client = await Client.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    const design = await Design.findById(id)
      .populate('createdBy', 'name email')
      .lean();

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found"
      });
    }

    // Format the response
    const designDetails = {
      ...design,
      createdByName: design.createdBy?.name || design.createdByName || 'Unknown',
      createdByEmail: design.createdBy?.email || '',
      canComment: design.isChatEnabled !== false
    };

    res.json({
      success: true,
      data: designDetails
    });
  } catch (error) {
    console.error('Error fetching client design details:', error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Get client statistics - only review and approved
const getClientStats = async (req, res) => {
  try {
    const clientEmail = req.query.email;

    // Verify client exists
    const client = await Client.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    const stats = await Design.aggregate([
      {
        $match: {
          status: { $in: ['review', 'approved'] }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      review: 0,
      approved: 0
    };

    stats.forEach(stat => {
      formattedStats.total += stat.count;
      if (stat._id === 'review') {
        formattedStats.review += stat.count;
      } else if (stat._id === 'approved') {
        formattedStats.approved += stat.count;
      }
    });

    res.json({
      success: true,
      data: {
        stats: formattedStats,
        client: {
          name: client.name,
          email: client.email,
          company: client.company
        }
      }
    });
  } catch (error) {
    console.error('Error fetching client stats:', error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Get all versions of a design for client - ENHANCED
const getClientDesignVersions = async (req, res) => {
  try {
    const { designId } = req.params;
    const clientEmail = req.query.email;

    // Verify client exists
    const client = await Client.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    // Find the current design
    const currentDesign = await Design.findById(designId);
    if (!currentDesign) {
      return res.status(404).json({
        success: false,
        message: "Design not found"
      });
    }

    console.log("Current design version:", currentDesign.versionNumber);
    console.log("Version history count:", currentDesign.versionHistory?.length || 0);

    // Create current version object
    const currentVersion = {
      _id: currentDesign._id,
      versionNumber: currentDesign.versionNumber,
      images: currentDesign.images || [],
      fileName: currentDesign.fileName,
      fileType: currentDesign.fileType,
      versionChanges: currentDesign.versionChanges || "",
      status: currentDesign.status,
      comments: currentDesign.comments || [],
      isChatEnabled: currentDesign.isChatEnabled !== false,
      createdAt: currentDesign.createdAt,
      updatedAt: currentDesign.updatedAt,
      createdBy: currentDesign.createdBy,
      createdByModel: currentDesign.createdByModel,
      isLatestVersion: true,
      // Include all design metadata
      siteId: currentDesign.siteId,
      siteName: currentDesign.siteName,
      floorName: currentDesign.floorName,
      scopeOfWork: currentDesign.scopeOfWork,
      workItem: currentDesign.workItem,
      workType: currentDesign.workType,
      imageType: currentDesign.imageType,
      title: currentDesign.title,
      description: currentDesign.description,
      workflow_remark: currentDesign.workflow_remark || "",
      createdByName: currentDesign.createdByName || 'Unknown'
    };

    // Create version history objects
    const versionHistory = (currentDesign.versionHistory || []).map(version => ({
      _id: currentDesign._id, // Same design ID for all versions
      versionNumber: version.versionNumber,
      images: version.images || [],
      fileName: version.fileName,
      fileType: version.fileType,
      versionChanges: version.versionChanges || "",
      status: version.status,
      comments: version.comments || [],
      isChatEnabled: version.isChatEnabled !== false,
      createdAt: version.createdAt,
      updatedAt: version.updatedAt,
      createdBy: version.createdBy,
      createdByModel: version.createdByModel,
      isLatestVersion: false,
      // Include all design metadata
      siteId: currentDesign.siteId,
      siteName: currentDesign.siteName,
      floorName: currentDesign.floorName,
      scopeOfWork: currentDesign.scopeOfWork,
      workItem: currentDesign.workItem,
      workType: currentDesign.workType,
      imageType: currentDesign.imageType,
      title: currentDesign.title,
      description: currentDesign.description,
      workflow_remark: version.workflow_remark || "",
      createdByName: currentDesign.createdByName || 'Unknown'
    }));

    // Combine all versions (current + history)
    const allVersions = [currentVersion, ...versionHistory];
    
    // Sort by version number (newest first)
    allVersions.sort((a, b) => b.versionNumber - a.versionNumber);

    console.log("Returning client versions:", allVersions.length);
    allVersions.forEach(v => console.log(`- V${v.versionNumber}, status: ${v.status}, images: ${v.images?.length}`));

    res.json({
      success: true,
      data: allVersions,
      message: "Design versions retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching design versions for client:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

// Add this function to your client controller
const switchClientDesignVersion = async (req, res) => {
  try {
    const { designId } = req.params;
    const { versionNumber } = req.body;
    const clientEmail = req.query.email;

    console.log("Client switching to version:", versionNumber, "for design:", designId);

    // Verify client exists
    const client = await Client.findOne({ email: clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    const design = await Design.findById(designId);
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
        workflow_remark: design.workflow_remark || "",
        createdByName: design.createdByName || 'Unknown'
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
        workflow_remark: foundVersion.workflow_remark || "",
        createdByName: design.createdByName || 'Unknown'
      };
    }

    console.log("Returning version data for client V" + versionNumber + ":", {
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
    console.error("Error switching client version:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

module.exports = {
  getClientDesigns,
  handleClientAction,
  addClientComment,
  getClientDesignDetails,
  getClientStats,
  getClientDesignVersions,
  switchClientDesignVersion
};
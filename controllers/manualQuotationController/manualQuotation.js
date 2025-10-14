const ManualQuotation = require('../../Schema/ManualQuotation.schema/manualQuotation');
const User = require('../../Schema/users.schema/users.model');

// Generate unique quotation ID with retry logic
const generateQuotationId = async () => {
  let attempt = 0;
  const maxAttempts = 5;
  
  while (attempt < maxAttempts) {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const quotationId = `QT-MANUAL-${timestamp}-${random}`;
      
      const existingQuotation = await ManualQuotation.findOne({ quotationId });
      
      if (!existingQuotation) {
        return quotationId;
      }
      
      attempt++;
    } catch (error) {
      console.error('Error generating quotation ID:', error);
      attempt++;
    }
  }
  
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `QT-MANUAL-${timestamp}-${random}`;
};

// Generate unique quotation ID for versions
const generateUniqueQuotationId = async (baseQuotationId, versionNumber) => {
  let attempt = 0;
  const maxAttempts = 5;
  
  while (attempt < maxAttempts) {
    try {
      const baseId = baseQuotationId.split('-V')[0];
      const newQuotationId = `${baseId}-V${versionNumber}`;
      
      const existingQuotation = await ManualQuotation.findOne({ quotationId: newQuotationId });
      
      if (!existingQuotation) {
        return newQuotationId;
      }
      
      attempt++;
      const timestamp = Date.now();
      const uniqueQuotationId = `${baseId}-V${versionNumber}-${timestamp}`;
      
      const existingWithTimestamp = await ManualQuotation.findOne({ quotationId: uniqueQuotationId });
      if (!existingWithTimestamp) {
        return uniqueQuotationId;
      }
      
    } catch (error) {
      console.error('Error generating unique quotation ID:', error);
      attempt++;
    }
  }
  
  const baseId = baseQuotationId.split('-V')[0];
  const timestamp = Date.now();
  return `${baseId}-V${versionNumber}-${timestamp}`;
};

// NEW: Validate work items structure including tasks array
const validateWorkItems = (workItems) => {
  if (!workItems || !Array.isArray(workItems)) {
    return { isValid: false, message: 'Work items must be an array' };
  }

  for (const workItem of workItems) {
    if (!workItem.workCategories || !Array.isArray(workItem.workCategories)) {
      return { isValid: false, message: 'Each work item must have workCategories array' };
    }

    for (const category of workItem.workCategories) {
      // Validate that tasks is an array (can be empty)
      if (category.tasks && !Array.isArray(category.tasks)) {
        return { isValid: false, message: 'Tasks must be an array' };
      }

      // Validate individual task structure if tasks exist
      if (category.tasks && category.tasks.length > 0) {
        for (const task of category.tasks) {
          if (!task.name || !task.workTypeId || !task.workType || !task.workCategory || !task.scopeOfWork || !task.projectType) {
            return { 
              isValid: false, 
              message: 'Each task must have name, workTypeId, workType, workCategory, scopeOfWork, and projectType fields' 
            };
          }
        }
      }
    }
  }

  return { isValid: true };
};

// Create new manual quotation
exports.createManualQuotation = async (req, res) => {
  try {
    const email = req.query.email
    const {
      siteName,
      clientName,
      totalAmount,
      status,
      sections,
      clientData,
      workItems,
      assignedTo
    } = req.body;

    if (!siteName || !clientName || !totalAmount || !clientData || !workItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate work items structure including tasks array
    const validationResult = validateWorkItems(workItems);
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: validationResult.message
      });
    }

    const quotationId = await generateQuotationId();

    const manualQuotation = new ManualQuotation({
      quotationId,
      siteName,
      clientName,
      generatedDate: new Date(),
      totalAmount,
      status: status || 'Draft',
      sections: sections || workItems.length,
      type: 'manual',
      clientData,
      workItems,
      createdBy: email,
      assignedTo: assignedTo || null,
      versionNumber: 0,
      isLatestVersion: true
    });

    const savedQuotation = await manualQuotation.save();

    res.status(200).send({
      success: true,
      message: 'Manual quotation created successfully',
      data: savedQuotation
    });
  } catch (error) {
    console.error('Error creating manual quotation:', error);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all manual quotations for a user (Admin view)
exports.getAllManualQuotations = async (req, res) => {
  try {
    const quotations = await ManualQuotation.find({ isLatestVersion: true })
      .sort({ createdAt: -1 })
      .select('-__v')
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Manual quotations fetched successfully',
      data: quotations,
    });
  } catch (error) {
    console.error('Error fetching manual quotations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// NEW: Approve quotation (Admin action)
exports.approveQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email;

    const quotation = await ManualQuotation.findById(id);
    
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Check if quotation is already approved
    if (quotation.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Quotation is already approved'
      });
    }

    // Calculate next version number
    const nextVersionNumber = quotation.versionNumber + 1;

    // Create version history entry for current version
    const versionHistoryEntry = {
      versionNumber: quotation.versionNumber,
      quotationId: quotation.quotationId,
      createdDate: quotation.generatedDate,
      changes: `Approved by admin - Version ${nextVersionNumber} created`,
      createdBy: quotation.createdBy,
      status: 'Approved',
      totalAmount: quotation.totalAmount,
      clientRemarks: quotation.clientRemarks,
      workItemComments: quotation.workItemComments,
      approvedBy: {
        email: email,
        approvedAt: new Date()
      }
    };

    // Generate new quotation ID for next version
    const newQuotationId = await generateUniqueQuotationId(quotation.quotationId, nextVersionNumber);

    // Update current quotation to not be latest
    await ManualQuotation.findByIdAndUpdate(id, {
      isLatestVersion: false,
      status: 'Approved',
      versionHistory: [...(quotation.versionHistory || []), versionHistoryEntry],
      approvedBy: {
        email: email,
        approvedAt: new Date()
      }
    });

    // Create new approved version
    const newQuotation = new ManualQuotation({
      ...quotation.toObject(),
      _id: undefined,
      quotationId: newQuotationId,
      versionNumber: nextVersionNumber,
      status: 'Approved',
      isLatestVersion: true,
      parentQuotationId: quotation.parentQuotationId || quotation._id,
      versionHistory: [...(quotation.versionHistory || []), versionHistoryEntry],
      generatedDate: new Date(),
      updatedDate: new Date(),
      approvedBy: {
        email: email,
        approvedAt: new Date()
      }
    });

    const savedQuotation = await newQuotation.save();
    const populatedQuotation = await ManualQuotation.findById(savedQuotation._id)
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Quotation approved successfully and version ${nextVersionNumber} created`,
      data: populatedQuotation
    });
  } catch (error) {
    console.error('Error approving quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getClientQuotations = async (req, res) => {
  try {
    const email = req.query.email;
    
    console.log("Fetching quotations for email:", email);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        data: [],
      });
    }

    const quotations = await ManualQuotation.find({ 
      isLatestVersion: true,
      $or: [
        { 'assignedTo.email': email },
        { 'clientData.clientEmail': email }
      ]
    })
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    console.log(`Found ${quotations.length} quotations for client: ${email}`);
    
    res.status(200).json({
      success: true,
      message: quotations.length > 0 
        ? 'Client quotations fetched successfully' 
        : 'No quotations found for this client',
      data: quotations,
    });
  } catch (error) {
    console.error('Error fetching client quotations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      data: []
    });
  }
};

// Get single manual quotation by ID
exports.getManualQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await ManualQuotation.findOne({
      _id: id
    })
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Manual quotation fetched successfully',
      data: quotation
    });
  } catch (error) {
    console.error('Error fetching manual quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update manual quotation
exports.updateManualQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email;
    const updateData = req.body;

    console.log('Updating quotation:', id, 'by user:', email);

    const existingQuotation = await ManualQuotation.findById(id);
    if (!existingQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    // Validate work items if they are being updated
    if (updateData.workItems) {
      const validationResult = validateWorkItems(updateData.workItems);
      if (!validationResult.isValid) {
        return res.status(400).json({
          success: false,
          message: validationResult.message
        });
      }
    }

    delete updateData._id;
    delete updateData.quotationId;
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData.versionNumber;
    delete updateData.isLatestVersion;
    delete updateData.parentQuotationId;

    updateData.updatedDate = new Date();

    const quotation = await ManualQuotation.findOneAndUpdate(
      { _id: id },
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    )
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    if (quotation.autoSendToClient) {
      quotation.status = 'Sent';
      quotation.autoSendToClient = false;
      await quotation.save();
    }

    res.status(200).json({
      success: true,
      message: 'Manual quotation updated successfully',
      data: quotation
    });
  } catch (error) {
    console.error('Error updating manual quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete manual quotation
exports.deleteManualQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await ManualQuotation.findOneAndDelete({
      _id: id,
      createdBy: req.user._id
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Manual quotation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting manual quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update quotation status (Admin only)
exports.updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Draft', 'Sent', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const quotation = await ManualQuotation.findOneAndUpdate(
      { 
        _id: id, 
        createdBy: req.user._id 
      },
      { 
        status,
        updatedDate: new Date()
      },
      { new: true }
    )
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quotation status updated successfully',
      data: quotation
    });
  } catch (error) {
    console.error('Error updating quotation status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Mark quotation as version 1 (Admin action)
exports.markAsVersionOne = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email;

    const quotation = await ManualQuotation.findById(id);
    
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    if (quotation.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved quotations can be marked as version 1'
      });
    }

    quotation.versionNumber = 1;
    quotation.updatedDate = new Date();
    
    await quotation.save();

    const populatedQuotation = await ManualQuotation.findById(quotation._id)
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Quotation marked as version 1 successfully',
      data: populatedQuotation
    });
  } catch (error) {
    console.error('Error marking quotation as version 1:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// UPDATED: Update quotation status by client (Client actions) - Now includes approvedBy
exports.updateQuotationStatusByClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, clientRemarks, workItemComments } = req.body;
    console.log("Client status update:", id, status, clientRemarks, workItemComments);
    
    if (!status || !['Approved', 'Revised'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (Approved or Revised)'
      });
    }

    const quotation = await ManualQuotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    const email = req.query.email;
    const isAssignedUser = quotation.assignedTo && quotation.assignedTo.email === email;
    const isClient = quotation.clientData && quotation.clientData.clientEmail === email;
    
    if (!isAssignedUser && !isClient) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not assigned to this quotation.'
      });
    }

    // UPDATED: If client approves, create next version with approvedBy field
    if (status === 'Approved') {
      const nextVersionNumber = quotation.versionNumber + 1;
      
      // Create version history entry for current version
      const versionHistoryEntry = {
        versionNumber: quotation.versionNumber,
        quotationId: quotation.quotationId,
        createdDate: quotation.generatedDate,
        changes: `Approved by client - Version ${nextVersionNumber} created`,
        createdBy: quotation.createdBy,
        status: 'Approved',
        totalAmount: quotation.totalAmount,
        clientRemarks: clientRemarks || '',
        workItemComments: workItemComments || {},
        approvedBy: {
          email: email,
          approvedAt: new Date()
        }
      };

      // Generate new quotation ID for next version
      const newQuotationId = await generateUniqueQuotationId(quotation.quotationId, nextVersionNumber);

      // Update current quotation to not be latest and set approvedBy
      await ManualQuotation.findByIdAndUpdate(id, {
        isLatestVersion: false,
        status: 'Approved',
        versionHistory: [...(quotation.versionHistory || []), versionHistoryEntry],
        clientRemarks: clientRemarks || '',
        workItemComments: workItemComments || {},
        approvedBy: {
          email: email,
          approvedAt: new Date()
        }
      });

      // Create new approved version with approvedBy field
      const newQuotation = new ManualQuotation({
        ...quotation.toObject(),
        _id: undefined,
        quotationId: newQuotationId,
        versionNumber: nextVersionNumber,
        status: 'Approved',
        isLatestVersion: true,
        parentQuotationId: quotation.parentQuotationId || quotation._id,
        versionHistory: [...(quotation.versionHistory || []), versionHistoryEntry],
        clientRemarks: clientRemarks || '',
        workItemComments: workItemComments || {},
        generatedDate: new Date(),
        updatedDate: new Date(),
        approvedBy: {
          email: email,
          approvedAt: new Date()
        }
      });

      const savedQuotation = await newQuotation.save();
      const populatedQuotation = await ManualQuotation.findById(savedQuotation._id)
        .populate('assignedTo.userId', 'name email role')
        .populate('assignedTo.assignedBy', 'name email')
        .populate('createdBy', 'name email');

      return res.status(200).json({
        success: true,
        message: `Quotation approved successfully and version ${nextVersionNumber} created`,
        data: populatedQuotation
      });
    }

    // If client requests revisions, update status and save comments
    if (status === 'Revised') {
      console.log("Updating quotation with revision feedback");
      
      const updateData = {
        status: 'Revised',
        updatedDate: new Date(),
        clientRemarks: clientRemarks || '',
        workItemComments: workItemComments || {}
      };

      const updatedQuotation = await ManualQuotation.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');

      console.log("Updated quotation:", updatedQuotation);

      return res.status(200).json({
        success: true,
        message: 'Revision requested successfully. Admin will review your feedback.',
        data: updatedQuotation
      });
    }

  } catch (error) {
    console.error('Error updating quotation status by client:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all versions of a quotation
exports.getQuotationVersions = async (req, res) => {
  try {
    const { id } = req.params;

    const clickedQuotation = await ManualQuotation.findById(id);
    
    if (!clickedQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    const rootQuotationId = clickedQuotation.parentQuotationId || clickedQuotation._id;

    const versions = await ManualQuotation.find({
      $or: [
        { _id: rootQuotationId },
        { parentQuotationId: rootQuotationId }
      ]
    })
    .sort({ versionNumber: 1 })
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    if (!versions || versions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No quotation versions found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quotation versions fetched successfully',
      data: versions
    });
  } catch (error) {
    console.error('Error fetching quotation versions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create revision
exports.createRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const { revisionReason, changes } = req.body;

    if (!revisionReason) {
      return res.status(400).json({
        success: false,
        message: 'Revision reason is required'
      });
    }

    const originalQuotation = await ManualQuotation.findById(id);

    if (!originalQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    const nextVersionNumber = originalQuotation.versionNumber + 1;

    const versionHistoryEntry = {
      versionNumber: originalQuotation.versionNumber,
      quotationId: originalQuotation.quotationId,
      createdDate: originalQuotation.generatedDate,
      changes: changes || `Revised: ${revisionReason}`,
      createdBy: originalQuotation.createdBy,
      status: originalQuotation.status,
      totalAmount: originalQuotation.totalAmount,
      clientRemarks: originalQuotation.clientRemarks,
      workItemComments: originalQuotation.workItemComments
    };

    await ManualQuotation.findByIdAndUpdate(id, {
      isLatestVersion: false,
      status: 'Revised',
      versionHistory: [...(originalQuotation.versionHistory || []), versionHistoryEntry]
    });

    const newQuotationId = await generateUniqueQuotationId(originalQuotation.quotationId, nextVersionNumber);

    const rootParentId = originalQuotation.parentQuotationId || originalQuotation._id;

    const revisionQuotation = new ManualQuotation({
      ...originalQuotation.toObject(),
      _id: undefined,
      quotationId: newQuotationId,
      versionNumber: nextVersionNumber,
      isLatestVersion: true,
      parentQuotationId: rootParentId,
      generatedDate: new Date(),
      updatedDate: new Date(),
      status: 'Sent',
      revisionReason: revisionReason,
      clientRemarks: '',
      workItemComments: {},
      versionHistory: [],
      assignedTo: originalQuotation.assignedTo || null,
      autoSendToClient: false
    });

    const savedRevision = await revisionQuotation.save();

    const populatedRevision = await ManualQuotation.findById(savedRevision._id)
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Quotation revision created and sent to client successfully',
      data: populatedRevision
    });
  } catch (error) {
    console.error('Error creating quotation revision:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get specific version of quotation
exports.getQuotationVersion = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;

    const version = await ManualQuotation.findOne({
      $or: [
        { _id: id, versionNumber: parseInt(versionNumber) },
        { parentQuotationId: id, versionNumber: parseInt(versionNumber) }
      ]
    })
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Quotation version not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quotation version fetched successfully',
      data: version
    });
  } catch (error) {
    console.error('Error fetching quotation version:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Assign user to quotation
exports.assignUserToQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, name, email, role } = req.body;

    if (!userId || !name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'User ID, name, email, and role are required'
      });
    }

    const userToAssign = await User.findById(userId);
    if (!userToAssign) {
      return res.status(404).json({
        success: false,
        message: 'User to assign not found'
      });
    }

    const assignedUserData = {
      userId: userId,
      name: name,
      email: email,
      role: role,
      assignedBy: req.user._id,
      assignedAt: new Date()
    };

    const quotation = await ManualQuotation.findOneAndUpdate(
      { 
        _id: id
      },
      { 
        assignedTo: assignedUserData,
        updatedDate: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    )
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User assigned to quotation successfully',
      data: quotation
    });
  } catch (error) {
    console.error('Error assigning user to quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Remove assigned user from quotation
exports.removeAssignedUser = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await ManualQuotation.findOneAndUpdate(
      { 
        _id: id
      },
      { 
        $unset: { assignedTo: 1 },
        updatedDate: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    )
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assigned user removed from quotation successfully',
      data: quotation
    });
  } catch (error) {
    console.error('Error removing assigned user from quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
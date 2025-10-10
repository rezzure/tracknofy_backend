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
      
      // Check if this ID already exists
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
  
  // Fallback
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `QT-MANUAL-${timestamp}-${random}`;
};

// Generate unique quotation ID for revisions
const generateUniqueQuotationId = async (baseQuotationId, versionNumber) => {
  let attempt = 0;
  const maxAttempts = 5;
  
  while (attempt < maxAttempts) {
    try {
      // Remove any existing version suffix and add new version
      const baseId = baseQuotationId.split('-V')[0];
      const newQuotationId = `${baseId}-V${versionNumber}`;
      
      // Check if this ID already exists
      const existingQuotation = await ManualQuotation.findOne({ quotationId: newQuotationId });
      
      if (!existingQuotation) {
        return newQuotationId;
      }
      
      // If ID exists, try with timestamp to make it unique
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
  
  // Fallback: use timestamp-based ID
  const baseId = baseQuotationId.split('-V')[0];
  const timestamp = Date.now();
  return `${baseId}-V${versionNumber}-${timestamp}`;
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

    // Validate required fields
    if (!siteName || !clientName || !totalAmount || !clientData || !workItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Use async quotation ID generation
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
      versionNumber: 1,
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

    // Find quotations that are either:
    // 1. Assigned to the current user's email, OR
    // 2. Have client email matching current user's email
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
    
    // Always return success with data (even if empty)
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
      data: [] // Ensure data is always an array
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
    const email = req.query.email; // Get email from query params
    const updateData = req.body;

    console.log('Updating quotation:', id, 'by user:', email);

    // Find the quotation first
    const existingQuotation = await ManualQuotation.findById(id);
    if (!existingQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.quotationId;
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData.versionNumber;
    delete updateData.isLatestVersion;
    delete updateData.parentQuotationId;

    // Add updated date
    updateData.updatedDate = new Date();

    // FIX: Remove the createdBy filter since we're using email
    const quotation = await ManualQuotation.findOneAndUpdate(
      { _id: id }, // Removed: createdBy: req.user._id
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

    // If autoSendToClient is true, automatically update status to Sent
    if (quotation.autoSendToClient) {
      quotation.status = 'Sent';
      quotation.autoSendToClient = false; // Reset the flag
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

// Update quotation status by client (Client actions)
exports.updateQuotationStatusByClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, clientRemarks, workItemComments } = req.body;
    console.log(id,status, clientRemarks, workItemComments)
    
    if (!status || !['Approved', 'Revised'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (Approved or Revised)'
      });
    }

    const quotation = await ManualQuotation.findById({_id:id});

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Check if user is assigned to this quotation or is the client
    const email = req.query.email;
    console.log(email)
    const isAssignedUser = quotation.assignedTo && quotation.assignedTo.email === email;
    console.log(isAssignedUser)
    const isClient = quotation.clientData && quotation.clientData.clientEmail === email;
    console.log(isClient)
    if (!isAssignedUser && !isClient) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not assigned to this quotation.'
      });
    }

    let updateData = {
      status,
      updatedDate: new Date(),
      clientRemarks: clientRemarks || '',
      workItemComments: workItemComments || {}
    };

    // If client approves, create a new approved version
    if (status === 'Approved') {
      // Create version history entry for current version
      const versionHistoryEntry = {
        versionNumber: quotation.versionNumber,
        quotationId: quotation.quotationId,
        createdDate: quotation.generatedDate,
        changes: 'Approved by client',
        createdBy: quotation.createdBy,
        status: 'Approved',
        totalAmount: quotation.totalAmount,
        clientRemarks: clientRemarks || '',
        workItemComments: workItemComments || {}
      };

      // Update current quotation to not be latest and mark as approved
      await ManualQuotation.findByIdAndUpdate(id, {
        isLatestVersion: false,
        status: 'Approved',
        versionHistory: [...(quotation.versionHistory || []), versionHistoryEntry]
      });

      // Generate unique quotation ID for the new approved version
      const newVersionNumber = quotation.versionNumber + 1;
      const newQuotationId = await generateUniqueQuotationId(quotation.quotationId, newVersionNumber);

      // Create new approved version (same data but marked as approved and latest)
      const newQuotation = new ManualQuotation({
        ...quotation.toObject(),
        _id: undefined,
        quotationId: newQuotationId,
        versionNumber: newVersionNumber,
        status: 'Approved',
        isLatestVersion: true,
        versionHistory: [...(quotation.versionHistory || []), versionHistoryEntry],
        clientRemarks: clientRemarks || '',
        workItemComments: workItemComments || {},
        generatedDate: new Date(),
        updatedDate: new Date()
      });

      const savedQuotation = await newQuotation.save();
      const populatedQuotation = await ManualQuotation.findById(savedQuotation._id)
        .populate('assignedTo.userId', 'name email role')
        .populate('assignedTo.assignedBy', 'name email')
        .populate('createdBy', 'name email');

      return res.status(200).json({
        success: true,
        message: 'Quotation approved successfully',
        data: populatedQuotation
      });
    }

    // If client requests revisions, update status and auto-create revision
    if (status === 'Revised') {
      updateData.status = 'Revised';
      
      const updatedQuotation = await ManualQuotation.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');

      // Auto-create revision for admin to work on
      await this.createRevisionFromClientFeedback(id, clientRemarks, workItemComments, req.user._id);

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

// Helper function to create revision from client feedback
exports.createRevisionFromClientFeedback = async (quotationId, clientRemarks, workItemComments, userId) => {
  try {
    const originalQuotation = await ManualQuotation.findById(quotationId);
    
    if (!originalQuotation) {
      throw new Error('Quotation not found');
    }

    // Create version history entry for original quotation
    const versionHistoryEntry = {
      versionNumber: originalQuotation.versionNumber,
      quotationId: originalQuotation.quotationId,
      createdDate: originalQuotation.generatedDate,
      changes: 'Client requested revisions: ' + (clientRemarks || 'No specific remarks'),
      createdBy: originalQuotation.createdBy,
      status: 'Revised',
      totalAmount: originalQuotation.totalAmount,
      clientRemarks: clientRemarks || '',
      workItemComments: workItemComments || {}
    };

    // Update original quotation to not be latest version
    await ManualQuotation.findByIdAndUpdate(quotationId, {
      isLatestVersion: false,
      status: 'Revised',
      versionHistory: [...(originalQuotation.versionHistory || []), versionHistoryEntry]
    });

    // Create new revision with client feedback
    const newVersionNumber = originalQuotation.versionNumber + 1;
    
    // FIX: Generate unique quotation ID for the revision
    const newQuotationId = await generateUniqueQuotationId(originalQuotation.quotationId, newVersionNumber);

    const revisionQuotation = new ManualQuotation({
      ...originalQuotation.toObject(),
      _id: undefined,
      quotationId: newQuotationId,
      versionNumber: newVersionNumber,
      isLatestVersion: true,
      parentQuotationId: originalQuotation._id,
      generatedDate: new Date(),
      updatedDate: new Date(),
      status: 'Draft',
      revisionReason: `Client requested revisions: ${clientRemarks || 'No specific remarks'}`,
      clientRemarks: '',
      workItemComments: {},
      versionHistory: [],
      assignedTo: originalQuotation.assignedTo || null,
      // Set auto-send flag to true so when admin saves, it automatically sends to client
      autoSendToClient: true
    });

    await revisionQuotation.save();
    
  } catch (error) {
    console.error('Error creating revision from client feedback:', error);
    throw error;
  }
};

// Assign user to quotation
exports.assignUserToQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, name, email, role } = req.body;

    // Validate required fields
    if (!userId || !name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'User ID, name, email, and role are required'
      });
    }

    // Verify the user exists
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

// Create revision of quotation
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

    // Find the original quotation
    const originalQuotation = await ManualQuotation.findOne({
      _id: id
    });

    if (!originalQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Create version history entry for original quotation
    const versionHistoryEntry = {
      versionNumber: originalQuotation.versionNumber,
      quotationId: originalQuotation.quotationId,
      createdDate: originalQuotation.generatedDate,
      changes: changes || 'Initial version',
      createdBy: originalQuotation.createdBy,
      status: originalQuotation.status,
      totalAmount: originalQuotation.totalAmount,
      clientRemarks: originalQuotation.clientRemarks,
      workItemComments: originalQuotation.workItemComments
    };

    // Update original quotation to not be latest version
    await ManualQuotation.findByIdAndUpdate(id, {
      isLatestVersion: false,
      status: 'Revised',
      versionHistory: [...(originalQuotation.versionHistory || []), versionHistoryEntry]
    });

    // Create new revision
    const newVersionNumber = originalQuotation.versionNumber + 1;
    
    // FIX: Generate unique quotation ID for the revision
    const newQuotationId = await generateUniqueQuotationId(originalQuotation.quotationId, newVersionNumber);

    const revisionQuotation = new ManualQuotation({
      ...originalQuotation.toObject(),
      _id: undefined, // Let MongoDB generate new _id
      quotationId: newQuotationId,
      versionNumber: newVersionNumber,
      isLatestVersion: true,
      parentQuotationId: originalQuotation._id,
      generatedDate: new Date(),
      updatedDate: new Date(),
      status: 'Draft',
      revisionReason: revisionReason,
      clientRemarks: '',
      workItemComments: {},
      versionHistory: [],
      assignedTo: originalQuotation.assignedTo || null,
      // Set auto-send to true for automatic sending after admin edits
      autoSendToClient: true
    });

    const savedRevision = await revisionQuotation.save();

    // Populate the saved revision
    const populatedRevision = await ManualQuotation.findById(savedRevision._id)
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Quotation revision created successfully',
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

// Get all versions of a quotation
exports.getQuotationVersions = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the root quotation (the one that was clicked)
    const rootQuotation = await ManualQuotation.findById(id);
    
    if (!rootQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Find all versions - either parent is the root or the quotation itself is the root
    let versions;
    
    if (rootQuotation.parentQuotationId) {
      // If this quotation has a parent, get all versions from the parent
      versions = await ManualQuotation.find({
        $or: [
          { _id: rootQuotation.parentQuotationId },
          { parentQuotationId: rootQuotation.parentQuotationId }
        ]
      })
      .sort({ versionNumber: 1 })
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');
    } else {
      // If this is the root quotation, get all its versions
      versions = await ManualQuotation.find({
        $or: [
          { _id: rootQuotation._id },
          { parentQuotationId: rootQuotation._id }
        ]
      })
      .sort({ versionNumber: 1 })
      .populate('assignedTo.userId', 'name email role')
      .populate('assignedTo.assignedBy', 'name email')
      .populate('createdBy', 'name email');
    }

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
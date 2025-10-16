const Task = require('../../Schema/kanbanBoardTask.schema/kanbanBoardTask.model');
const ManualQuotation = require('../../Schema/ManualQuotation.schema/manualQuotation');
const Site = require('../../Schema/site.Schema/site.model');
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

// Validate work items structure including tasks array
const validateWorkItems = (workItems) => {
  if (!workItems || !Array.isArray(workItems)) {
    return { isValid: false, message: 'Work items must be an array' };
  }

  for (const workItem of workItems) {
    if (!workItem.workCategories || !Array.isArray(workItem.workCategories)) {
      return { isValid: false, message: 'Each work item must have workCategories array' };
    }

    for (const category of workItem.workCategories) {
      if (category.tasks && !Array.isArray(category.tasks)) {
        return { isValid: false, message: 'Tasks must be an array' };
      }

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

// NEW: Update site creation status
exports.updateSiteCreationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteId, siteName, clientUserId, clientEmail, createdBy } = req.body;

    if (!siteId || !siteName || !clientUserId || !clientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for site creation status update'
      });
    }

    const quotation = await ManualQuotation.findById(id);
    
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Update site creation status
    const updatedQuotation = await ManualQuotation.findByIdAndUpdate(
      id,
      {
        siteCreation: {
          isSiteCreated: true,
          siteId: siteId,
          siteName: siteName,
          clientUserId: clientUserId,
          clientEmail: clientEmail,
          createdBy: createdBy || req.query.email,
          createdAt: new Date()
        },
        updatedDate: new Date()
      },
      { new: true, runValidators: true }
    )
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Site creation status updated successfully',
      data: updatedQuotation
    });
  } catch (error) {
    console.error('Error updating site creation status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
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
      isLatestVersion: true,
      isArchived: false,
      siteCreation: {
        isSiteCreated: false,
        siteId: null,
        siteName: "",
        clientUserId: null,
        clientEmail: "",
        createdBy: "",
        createdAt: null
      }
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
    const { showArchived } = req.query;
    
    let query = { isLatestVersion: true };
    
    if (showArchived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    const quotations = await ManualQuotation.find(query)
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

// Archive/Restore quotation function
exports.archiveQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email;
    const { isArchived, archiveReason } = req.body;

    if (typeof isArchived !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isArchived field is required and must be a boolean'
      });
    }

    const quotation = await ManualQuotation.findById(id);
    
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    if (quotation.isArchived === isArchived) {
      return res.status(400).json({
        success: false,
        message: `Quotation is already ${isArchived ? 'archived' : 'active'}`
      });
    }

    const updateData = {
      isArchived: isArchived,
      updatedDate: new Date()
    };

    if (isArchived) {
      updateData.archivedBy = {
        email: email,
        archivedAt: new Date()
      };
      updateData.archiveReason = archiveReason || '';
    } else {
      updateData.archivedBy = undefined;
      updateData.archiveReason = '';
    }

    const updatedQuotation = await ManualQuotation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email')
    .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Quotation ${isArchived ? 'archived' : 'restored'} successfully`,
      data: updatedQuotation
    });
  } catch (error) {
    console.error('Error archiving/restoring quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Approve quotation (Admin action)
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

    if (quotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot approve an archived quotation'
      });
    }

    if (quotation.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Quotation is already approved'
      });
    }

    const nextVersionNumber = quotation.versionNumber + 1;

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

    const newQuotationId = await generateUniqueQuotationId(quotation.quotationId, nextVersionNumber);

    await ManualQuotation.findByIdAndUpdate(id, {
      isLatestVersion: false,
      status: 'Approved',
      versionHistory: [...(quotation.versionHistory || []), versionHistoryEntry],
      approvedBy: {
        email: email,
        approvedAt: new Date()
      }
    });

    const newQuotation = new ManualQuotation({
      ...quotation.toObject(),
      _id: undefined,
      quotationId: newQuotationId,
      versionNumber: nextVersionNumber,
      status: 'Approved',
      isLatestVersion: true,
      isArchived: false,
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

// Get client quotations with archive filter
exports.getClientQuotations = async (req, res) => {
  try {
    const email = req.query.email;
    const { showArchived } = req.query;
    
    console.log("Fetching quotations for email:", email);
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        data: [],
      });
    }

    let query = { 
      isLatestVersion: true,
      $or: [
        { 'assignedTo.email': email },
        { 'clientData.clientEmail': email }
      ]
    };

    if (showArchived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = false;
    }

    const quotations = await ManualQuotation.find(query)
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

    if (existingQuotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update an archived quotation'
      });
    }

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
    delete updateData.isArchived;
    delete updateData.archivedBy;
    delete updateData.archiveReason;
    delete updateData.siteCreation; // Prevent direct site creation modification

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

    const quotation = await ManualQuotation.findOne({
      _id: id,
      createdBy: req.user._id
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    if (quotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an archived quotation. Please restore it first.'
      });
    }

    await ManualQuotation.findOneAndDelete({
      _id: id,
      createdBy: req.user._id
    });

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

    const quotation = await ManualQuotation.findOne({ _id: id });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    if (quotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of an archived quotation'
      });
    }

    const updatedQuotation = await ManualQuotation.findOneAndUpdate(
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

    if (!updatedQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quotation status updated successfully',
      data: updatedQuotation
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

    if (quotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify an archived quotation'
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

// Update quotation status by client (Client actions)
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

    if (quotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update status of an archived quotation'
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

    if (status === 'Approved') {
      const nextVersionNumber = quotation.versionNumber + 1;
      
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

      const newQuotationId = await generateUniqueQuotationId(quotation.quotationId, nextVersionNumber);

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

      const newQuotation = new ManualQuotation({
        ...quotation.toObject(),
        _id: undefined,
        quotationId: newQuotationId,
        versionNumber: nextVersionNumber,
        status: 'Approved',
        isLatestVersion: true,
        isArchived: false,
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

    if (originalQuotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create revision from an archived quotation'
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
      isArchived: false,
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

    const quotation = await ManualQuotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    if (quotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign user to an archived quotation'
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

    const updatedQuotation = await ManualQuotation.findOneAndUpdate(
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

    if (!updatedQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User assigned to quotation successfully',
      data: updatedQuotation
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

    const quotation = await ManualQuotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    if (quotation.isArchived) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify an archived quotation'
      });
    }

    const updatedQuotation = await ManualQuotation.findOneAndUpdate(
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

    if (!updatedQuotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assigned user removed from quotation successfully',
      data: updatedQuotation
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


exports.activateTask = async (req,res)=>{
  try {
    const { id } = req.params; // Quotation ID from params
    const { email } = req.query; // User email from query

    // Validate input
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Quotation ID is required'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    // Find the quotation
    const quotation = await ManualQuotation.findById(id);
    
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    // Check if quotation is approved
    if (quotation.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved quotations can be activated for tasks'
      });
    }

    // Check if it's the latest version
    if (!quotation.isLatestVersion) {
      return res.status(400).json({
        success: false,
        message: 'You can only activate tasks from the latest version of the quotation'
      });
    }

    // Get client email from quotation
    const clientEmail = quotation.clientData?.clientEmail;
    
    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Client email not found in quotation data'
      });
    }

    // Find site by client email
    const site = await Site.findOne({ clientEmail: clientEmail });
    
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found for the client email in quotation'
      });
    }

    // Extract all tasks from workItems
    const tasksToCreate = [];
    let taskCounter = 0;

    // Iterate through workItems and workCategories to extract tasks
    quotation.workItems.forEach((workItem, workItemIndex) => {
      workItem.workCategories.forEach((workCategory, categoryIndex) => {
        if (workCategory.tasks && workCategory.tasks.length > 0) {
          workCategory.tasks.forEach((task, taskIndex) => {
            taskCounter++;
            
            const newTask = {
              title: task.name,
              // description: `Task from quotation: ${quotation.quotationId}. ${workCategory.workCategory} - ${workCategory.workType}`,
              status: 'todo', // Set status to 'todo' as required
              siteId: site._id,
              siteName: site.siteName,
              quotationId: quotation._id,
              workTypeId: task.workTypeId,
              workType: task.workType,
              workCategory: workCategory.workCategory,
              projectType: workItem.projectType,
              scopeOfWork: workItem.scopeOfWork,
              floor: workItem.floor,
              roomNumber: workItem.roomNumber,
              materials: workCategory.materials,
              sourceType: 'quotation',
              originalTaskId: task._id || `task-${workItemIndex}-${categoryIndex}-${taskIndex}`,
              assignorEmail: email,
              // You can add more fields as needed
              // tags: [
              //   workItem.projectType,
              //   workItem.scopeOfWork,
              //   workCategory.workCategory,
              //   'quotation-task'
              // ].filter(Boolean)
            };

            tasksToCreate.push(newTask);
          });
        }
      });
    });

    if (tasksToCreate.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tasks found in the quotation to activate'
      });
    }

    // Create all tasks in the database
    const createdTasks = await Task.insertMany(tasksToCreate);

    // Update the quotation to mark that tasks have been activated (optional)
    // You might want to add a field to track this in your ManualQuotation schema

    return res.status(200).json({
      success: true,
      message: `Successfully activated ${createdTasks.length} tasks from quotation`,
      data: {
        tasksCreated: createdTasks.length,
        siteId: site._id,
        siteName: site.siteName,
        quotationId: quotation._id,
        tasks: createdTasks.map(task => ({
          id: task._id,
          title: task.title,
          status: task.status,
          workType: task.workType
        }))
      }
    });

  } catch (error) {
    console.error('Error activating tasks:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while activating tasks',
      error: error.message
    });
  }
}
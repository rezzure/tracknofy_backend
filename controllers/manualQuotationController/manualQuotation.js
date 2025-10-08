// const ManualQuotation = require('../../Schema/ManualQuotation.schema/manualQuotation');

// // Generate unique quotation ID
// const generateQuotationId = () => {
//   const timestamp = Date.now();
//   const random = Math.floor(Math.random() * 1000);
//   return `QT-MANUAL-${timestamp}-${random}`;
// };

// // Create new manual quotation
// exports.createManualQuotation = async (req, res) => {
//   try {
//     const {
//       siteName,
//       clientName,
//       totalAmount,
//       status,
//       sections,
//       clientData,
//       workItems
//     } = req.body;

//     // Validate required fields
//     if (!siteName || !clientName || !totalAmount || !clientData || !workItems) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields'
//       });
//     }

//     const quotationId = generateQuotationId();

//     const manualQuotation = new ManualQuotation({
//       quotationId,
//       siteName,
//       clientName,
//       generatedDate: new Date(),
//       totalAmount,
//       status: status || 'Draft',
//       sections: sections || workItems.length,
//       type: 'manual',
//       clientData,
//       workItems,
//       createdBy: req.user._id
//     });

//     const savedQuotation = await manualQuotation.save();

//     res.status(201).json({
//       success: true,
//       message: 'Manual quotation created successfully',
//       data: savedQuotation
//     });
//   } catch (error) {
//     console.error('Error creating manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get all manual quotations for a user
// exports.getAllManualQuotations = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, search } = req.query;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = { createdBy: req.user._id };
    
//     if (status) {
//       filter.status = status;
//     }

//     if (search) {
//       filter.$or = [
//         { quotationId: { $regex: search, $options: 'i' } },
//         { siteName: { $regex: search, $options: 'i' } },
//         { clientName: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const quotations = await ManualQuotation.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .select('-__v');

//     const total = await ManualQuotation.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotations fetched successfully',
//       data: quotations,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / limit),
//         totalQuotations: total,
//         hasNext: page * limit < total,
//         hasPrev: page > 1
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching manual quotations:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get single manual quotation by ID
// exports.getManualQuotationById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const quotation = await ManualQuotation.findOne({
//       _id: id,
//       createdBy: req.user._id
//     });

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotation fetched successfully',
//       data: quotation
//     });
//   } catch (error) {
//     console.error('Error fetching manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Update manual quotation
// exports.updateManualQuotation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Remove fields that shouldn't be updated
//     delete updateData._id;
//     delete updateData.quotationId;
//     delete updateData.createdBy;
//     delete updateData.createdAt;

//     // Add updated date
//     updateData.updatedDate = new Date();

//     const quotation = await ManualQuotation.findOneAndUpdate(
//       { 
//         _id: id, 
//         createdBy: req.user._id 
//       },
//       updateData,
//       { 
//         new: true, 
//         runValidators: true 
//       }
//     );

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotation updated successfully',
//       data: quotation
//     });
//   } catch (error) {
//     console.error('Error updating manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Delete manual quotation
// exports.deleteManualQuotation = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const quotation = await ManualQuotation.findOneAndDelete({
//       _id: id,
//       createdBy: req.user._id
//     });

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotation deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Update quotation status
// exports.updateQuotationStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status || !['Draft', 'Sent', 'Approved', 'Rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid status is required'
//       });
//     }

//     const quotation = await ManualQuotation.findOneAndUpdate(
//       { 
//         _id: id, 
//         createdBy: req.user._id 
//       },
//       { 
//         status,
//         updatedDate: new Date()
//       },
//       { new: true }
//     );

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Quotation status updated successfully',
//       data: quotation
//     });
//   } catch (error) {
//     console.error('Error updating quotation status:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };



// const ManualQuotation = require('../../Schema/ManualQuotation.schema/manualQuotation');

// // Generate unique quotation ID
// const generateQuotationId = () => {
//   const timestamp = Date.now();
//   const random = Math.floor(Math.random() * 1000);
//   return `QT-MANUAL-${timestamp}-${random}`;
// };

// // Create new manual quotation
// exports.createManualQuotation = async (req, res) => {
//   try {
//     const {
//       siteName,
//       clientName,
//       totalAmount,
//       status,
//       sections,
//       clientData,
//       workItems
//     } = req.body;

//     // Validate required fields
//     if (!siteName || !clientName || !totalAmount || !clientData || !workItems) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields'
//       });
//     }

//     const quotationId = generateQuotationId();

//     const manualQuotation = new ManualQuotation({
//       quotationId,
//       siteName,
//       clientName,
//       generatedDate: new Date(),
//       totalAmount,
//       status: status || 'Draft',
//       sections: sections || workItems.length,
//       type: 'manual',
//       clientData,
//       workItems,
//       createdBy: req.user._id
//     });

//     const savedQuotation = await manualQuotation.save();

//     res.status(201).json({
//       success: true,
//       message: 'Manual quotation created successfully',
//       data: savedQuotation
//     });
//   } catch (error) {
//     console.error('Error creating manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get all manual quotations for a user (Admin view)
// exports.getAllManualQuotations = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status, search } = req.query;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = { createdBy: req.user._id };
    
//     if (status) {
//       filter.status = status;
//     }

//     if (search) {
//       filter.$or = [
//         { quotationId: { $regex: search, $options: 'i' } },
//         { siteName: { $regex: search, $options: 'i' } },
//         { clientName: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const quotations = await ManualQuotation.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .select('-__v');

//     const total = await ManualQuotation.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotations fetched successfully',
//       data: quotations,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / limit),
//         totalQuotations: total,
//         hasNext: page * limit < total,
//         hasPrev: page > 1
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching manual quotations:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get quotations for client (Client view) - NEW FUNCTION
// exports.getClientQuotations = async (req, res) => {
//   try {
//     // const { page = 1, limit = 10, status, search } = req.query;
//     // const skip = (page - 1) * limit;

//     // Build filter object - client can see quotations where client email or phone matches
//     const filter = {
//       $or: [
//         { 'clientData.clientEmail': req.user.email },
//         { 'clientData.clientPhone': req.user.phone }
//       ]
//     };
    
//     // if (status) {
//     //   filter.status = status;
//     // }

//     // if (search) {
//     //   filter.$or = [
//     //     ...filter.$or,
//     //     { quotationId: { $regex: search, $options: 'i' } },
//     //     { siteName: { $regex: search, $options: 'i' } },
//     //     { clientName: { $regex: search, $options: 'i' } }
//     //   ];
//     // }

//     // const quotations = await ManualQuotation.find(filter)
//       // .sort({ createdAt: -1 })
//       // .skip(skip)
//       // .limit(parseInt(limit))
//       // .select('-__v');
// const quotations = await ManualQuotation.find()
//     // const total = await ManualQuotation.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       message: 'Client quotations fetched successfully',
//       data: quotations,
//       // pagination: {
//       //   currentPage: parseInt(page),
//       //   totalPages: Math.ceil(total / limit),
//       //   totalQuotations: total,
//       //   hasNext: page * limit < total,
//       //   hasPrev: page > 1
//       // }
//     });
//   } catch (error) {
//     console.error('Error fetching client quotations:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Get single manual quotation by ID
// exports.getManualQuotationById = async (req, res) => {
//   try {
//     const { id } = req.params;
// console.log(id)
//     // Check if user is admin (creator) or client
//     let quotation;
//     console.log(req.user.role)
//     // if (req.user.role === 'admin') {
//       quotation = await ManualQuotation.findOne({
//         _id: id,
//         createdBy: req.user._id
//       });
//     // } else {
//     //   // Client can view if their email/phone matches
//     //   quotation = await ManualQuotation.findOne({
//     //     _id: id,
//     //     $or: [
//     //       { 'clientData.clientEmail': req.user.email },
//     //       { 'clientData.clientPhone': req.user.phone }
//     //     ]
//     //   });
//     // }

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotation fetched successfully',
//       data: quotation
//     });
//   } catch (error) {
//     console.error('Error fetching manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Update manual quotation
// exports.updateManualQuotation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Remove fields that shouldn't be updated
//     delete updateData._id;
//     delete updateData.quotationId;
//     delete updateData.createdBy;
//     delete updateData.createdAt;

//     // Add updated date
//     updateData.updatedDate = new Date();

//     const quotation = await ManualQuotation.findOneAndUpdate(
//       { 
//         _id: id, 
//         createdBy: req.user._id 
//       },
//       updateData,
//       { 
//         new: true, 
//         runValidators: true 
//       }
//     );

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotation updated successfully',
//       data: quotation
//     });
//   } catch (error) {
//     console.error('Error updating manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Delete manual quotation
// exports.deleteManualQuotation = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const quotation = await ManualQuotation.findOneAndDelete({
//       _id: id,
//       createdBy: req.user._id
//     });

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Manual quotation deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting manual quotation:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Update quotation status (Admin only)
// exports.updateQuotationStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status || !['Draft', 'Sent', 'Approved', 'Rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid status is required'
//       });
//     }

//     const quotation = await ManualQuotation.findOneAndUpdate(
//       { 
//         _id: id, 
//         createdBy: req.user._id 
//       },
//       { 
//         status,
//         updatedDate: new Date()
//       },
//       { new: true }
//     );

//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Manual quotation not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Quotation status updated successfully',
//       data: quotation
//     });
//   } catch (error) {
//     console.error('Error updating quotation status:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };

// // Update quotation status by client (Client actions) - NEW FUNCTION
// exports.updateQuotationStatusByClient = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, clientRemarks, workItemComments } = req.body;
//     // Validate status for client actions
//     if (!status || !['Approved', 'Revised'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid status is required (Approved or Revised)'
//       });
//     }
//     // Find quotation and verify client access
//     const quotation = await ManualQuotation.findById({
//       _id: id
//     });
//     if (!quotation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Quotation not found or access denied'
//       });
//     }
//     // Prepare update data
//     const updateData = {
//       status,
//       updatedDate: new Date(),
//       clientRemarks: clientRemarks || '',
//       workItemComments: workItemComments || {}
//     };
//     // Update the quotation
//     const updatedQuotation = await ManualQuotation.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );
//     res.status(200).json({
//       success: true,
//       message: `Quotation ${status.toLowerCase()} successfully`,
//       data: updatedQuotation
//     });
//   } catch (error) {
//     console.error('Error updating quotation status by client:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error: error.message
//     });
//   }
// };













const ManualQuotation = require('../../Schema/ManualQuotation.schema/manualQuotation');
const User = require('../../Schema/users.schema/users.model'); // Make sure you have User model

// Generate unique quotation ID
const generateQuotationId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `QT-MANUAL-${timestamp}-${random}`;
};

// Create new manual quotation
exports.createManualQuotation = async (req, res) => {
  try {
    const {
      siteName,
      clientName,
      totalAmount,
      status,
      sections,
      clientData,
      workItems,
      assignedTo // NEW: Add assignedTo in creation
    } = req.body;

    // Validate required fields
    if (!siteName || !clientName || !totalAmount || !clientData || !workItems) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const quotationId = generateQuotationId();

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
      createdBy: req.user._id,
      assignedTo: assignedTo || null // NEW: Include assigned user
    });

    const savedQuotation = await manualQuotation.save();

    res.status(201).json({
      success: true,
      message: 'Manual quotation created successfully',
      data: savedQuotation
    });
  } catch (error) {
    console.error('Error creating manual quotation:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all manual quotations for a user (Admin view)
exports.getAllManualQuotations = async (req, res) => {
  try {
    // const { page = 1, limit = 10, status, search } = req.query;
    // const skip = (page - 1) * limit;

    // // Build filter object
    // const filter = { createdBy: req.user._id };
    
    // if (status) {
    //   filter.status = status;
    // }

    // if (search) {
    //   filter.$or = [
    //     { quotationId: { $regex: search, $options: 'i' } },
    //     { siteName: { $regex: search, $options: 'i' } },
    //     { clientName: { $regex: search, $options: 'i' } },
    //     { 'assignedTo.name': { $regex: search, $options: 'i' } }, // NEW: Search by assigned user name
    //     { 'assignedTo.email': { $regex: search, $options: 'i' } } // NEW: Search by assigned user email
    //   ];
    // }

    const quotations = await ManualQuotation.find()
    // const quotations = await ManualQuotation.find(filter)
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(parseInt(limit))
    //   .select('-__v')
    //   .populate('assignedTo.userId', 'name email role') // NEW: Populate assigned user details
    //   .populate('assignedTo.assignedBy', 'name email'); // NEW: Populate assigned by user details

    // const total = await ManualQuotation.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Manual quotations fetched successfully',
      data: quotations,
      // pagination: {
      //   currentPage: parseInt(page),
      //   totalPages: Math.ceil(total / limit),
      //   totalQuotations: total,
      //   hasNext: page * limit < total,
      //   hasPrev: page > 1
      // }
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

// Get quotations for client (Client view)
exports.getClientQuotations = async (req, res) => {
  try {
    const quotations = await ManualQuotation.find()
    if(quotations.length === 0){
      return res.status(400).send({
        success:false,
        message:"Data not found"
      })
    }
    res.status(200).json({
      success: true,
      message: 'Client quotations fetched successfully',
      data: quotations,
    });
  } catch (error) {
    console.error('Error fetching client quotations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single manual quotation by ID
exports.getManualQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
console.log(id)
    let quotation;
    
    quotation = await ManualQuotation.findOne({
      _id: id
    })
    // .populate('assignedTo.userId', 'name email role') // NEW: Populate assigned user details
    // .populate('assignedTo.assignedBy', 'name email'); // NEW: Populate assigned by user details

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
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.quotationId;
    delete updateData.createdBy;
    delete updateData.createdAt;

    // Add updated date
    updateData.updatedDate = new Date();

    const quotation = await ManualQuotation.findOneAndUpdate(
      { 
        _id: id, 
        createdBy: req.user._id 
      },
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    )
    .populate('assignedTo.userId', 'name email role')
    .populate('assignedTo.assignedBy', 'name email');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Manual quotation not found'
      });
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
    .populate('assignedTo.assignedBy', 'name email');

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
    console.log( status, clientRemarks, workItemComments ,id)
    
    if (!status || !['Approved', 'Revised'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (Approved or Revised)'
      });
    }

    const quotation = await ManualQuotation.findById({
      _id: id
    });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found or access denied'
      });
    }

    const updateData = {
      status,
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
    .populate('assignedTo.assignedBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Quotation ${status.toLowerCase()} successfully`,
      data: updatedQuotation
    });
  } catch (error) {
    console.error('Error updating quotation status by client:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// NEW FUNCTION: Assign user to quotation
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
        _id: id, 
        createdBy: req.user._id 
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
    .populate('assignedTo.assignedBy', 'name email');

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

// NEW FUNCTION: Remove assigned user from quotation
exports.removeAssignedUser = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await ManualQuotation.findOneAndUpdate(
      { 
        _id: id, 
        createdBy: req.user._id 
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
    .populate('assignedTo.assignedBy', 'name email');

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
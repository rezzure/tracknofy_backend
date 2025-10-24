

const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model.js");
const MaterialMaster = require('../../../Schema/materialMaster.schema/materialMaster.model.js');

const { default: mongoose } = require("mongoose");

// Create Material Request - Improved version

const createMaterialRequest = async (req, res) => {
  try {
    const { siteId, siteName, engineer, engineerEmail, materials, requiredBy, priority } = req.body;

    console.log('Received material request:', req.body);

    // Validate required fields
    if (!siteId || !siteName || !engineer || !engineerEmail || !requiredBy || !materials || materials.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Validate requiredBy date is not in the past
    const requiredByDate = new Date(requiredBy);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    if (requiredByDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Required by date cannot be in the past'
      });
    }

    // Validate materials array
    for (let material of materials) {
      if (!material.materialType || !material.name || !material.quantity || !material.unit) {
        return res.status(400).json({
          success: false,
          message: 'All material fields (type, name, quantity, unit) are required'
        });
      }

      // Validate quantity is positive number
      if (material.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Material quantity must be greater than 0'
        });
      }
    }

    // Generate request ID
    const requestCount = await MaterialRequest.countDocuments();
    const requestId = `REQ-${String(requestCount + 1).padStart(3, '0')}`;

    // Prepare materials with all fields
    const preparedMaterials = materials.map(material => ({
      materialType: material.materialType,
      name: material.name,
      materialBrand: material.materialBrand || '',
      quantity: Number(material.quantity),
      unit: material.unit,
      remarks: material.remarks || ''
    }));

    const newRequest = new MaterialRequest({
      requestId,
      siteId,
      siteName,
      engineer,
      engineerEmail: engineerEmail,
      materials: preparedMaterials,
      requiredBy: requiredByDate,
      priority: priority || 'medium',
      status: 'pending'
    });

    await newRequest.save();

    console.log('Material request created successfully:', newRequest.requestId);

    res.status(201).json({
      success: true,
      data: newRequest,
      message: 'Material request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating material request:', error);
    
    // Handle duplicate requestId error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Request ID already exists. Please try again.'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(', ')}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};



const countMaterialReqDoc = async (req, res) => {
  try {
    const count = await MaterialRequest.countDocuments();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error counting requests'
    });
  }
};


// Get All Material Requests (Admin)
const getAllMaterialRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }

    const requests = await MaterialRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
      message: 'Material requests fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching material requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// // Get Material Requests by Engineer
const getMaterialRequestsByEngineer = async (req, res) => {
  try {
    const { email } = req.query;

    const requests = await MaterialRequest.find({ engineerEmail: email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
      message: 'Material requests fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching material requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};




// Update Material Request Status (Approve/Reject)
// const updateMaterialRequestStatus = async (req, res) => {
//   try {
//     const { requestIds, status } = req.body;

//     console.log('Updating material request status:', { requestIds, status });

//     // Validate input
//     if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Request IDs array is required and cannot be empty'
//       });
//     }

//     if (!status || !['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid status (approved/rejected) is required'
//       });
//     }

//     // Update multiple requests
//     const result = await MaterialRequest.updateMany(
//       { 
//         requestId: { $in: requestIds },
//         status: 'pending' // Only update pending requests
//       },
//       { 
//         $set: { 
//           status: status, 
//           updatedAt: new Date() 
//         } 
//       }
//     );

//     console.log('Update result:', result);

//     // Check if any requests were modified
//     if (result.matchedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No pending material requests found with the provided IDs'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         matchedCount: result.matchedCount,
//         modifiedCount: result.modifiedCount
//       },
//       message: `${result.modifiedCount} material request(s) ${status} successfully`
//     });

//   } catch (error) {
//     console.error('Error updating material requests status:', error);
    
//     // Handle specific MongoDB errors
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid request ID format'
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error: ' + error.message
//     });
//   }
// };


// Update Material Request Status - For approval workflow
// const updateMaterialRequestStatus = async (req, res) => {
//   try {
//     const { requestIds, status, approvedBy } = req.body;

//     // Validate required fields
//     if (!requestIds || !status) {
//       return res.status(400).json({
//         success: false,
//         message: 'Request IDs and status are required'
//       });
//     }

//     // Validate status
//     const validStatuses = ['pending', 'approved', 'rejected', 'assigned'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Must be one of: pending, approved, rejected, assigned'
//       });
//     }

//     // Validate requestIds is an array
//     if (!Array.isArray(requestIds) || requestIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Request IDs must be a non-empty array'
//       });
//     }

//     // Update multiple requests
//     const updateData = {
//       status,
//       updatedAt: new Date()
//     };

//     // Add approval metadata if status is approved
//     if (status === 'approved') {
//       updateData.approvedBy = approvedBy || 'system';
//       updateData.approvedAt = new Date();
//       updateData.approvalType = approvedBy ? 'admin' : 'system';
//     }

//     // If status is rejected, clear approval data
//     if (status === 'rejected') {
//       updateData.approvedBy = null;
//       updateData.approvedAt = null;
//       updateData.approvalType = null;
//       updateData.rejectedBy = approvedBy || 'system';
//       updateData.rejectedAt = new Date();
//     }

//     const result = await MaterialRequest.updateMany(
//       { requestId: { $in: requestIds } },
//       { $set: updateData }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No material requests found with the provided IDs'
//       });
//     }

//     console.log(`Updated ${result.modifiedCount} material request(s) to status: ${status}`);

//     // Fetch updated requests to return
//     const updatedRequests = await MaterialRequest.find({ requestId: { $in: requestIds } });

//     res.json({
//       success: true,
//       data: updatedRequests,
//       message: `Successfully updated ${result.modifiedCount} request(s) to ${status} status`
//     });
//   } catch (error) {
//     console.error('Error updating material request status:', error);
    
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error: ' + error.message
//     });
//   }
// };








const getMaterialMaster = async (req, res) => {
  try {
    const materials = await MaterialMaster.find({ isActive: true });

    // Transform data to match frontend structure
    const materialTypes = materials.reduce((acc, material) => {
      const existingType = acc.find(item => item.type === material.materialType);
      
      if (existingType) {
        existingType.materials.push(material.materialName);
      } else {
        acc.push({
          id: material._id,
          type: material.materialType,
          materials: [material.materialName]
        });
      }
      
      return acc;
    }, []);

    res.status(200).json({
      success: true,
      data: materialTypes,
      message: 'Material master data fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching material master:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



// Update Single Material Request Status
const updateSingleMaterialRequestStatus = async (req, res) => {
  try {
    console.log("📝 UPDATE SINGLE STATUS - Body:", req.body);
    console.log("📝 UPDATE SINGLE STATUS - Params:", req.params);

    const { requestId } = req.params;
    const { status, approvedBy } = req.body;

    // Validate required fields
    if (!requestId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Request ID and status are required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'assigned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, assigned'
      });
    }

    // Find the material request
    const materialRequest = await MaterialRequest.findOne({ 
      $or: [
        { requestId: requestId },
        { _id: requestId }
      ]
    });

    if (!materialRequest) {
      return res.status(404).json({
        success: false,
        message: `Material request not found with ID: ${requestId}`
      });
    }

    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Add approval metadata
    if (status === 'approved') {
      updateData.approvedBy = approvedBy || 'system';
      updateData.approvedAt = new Date();
      updateData.approvalType = approvedBy ? 'admin' : 'self';
    } else if (status === 'rejected') {
      updateData.rejectedBy = approvedBy || 'system';
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = req.body.rejectionReason || null;
    }

    // Update the material request
    const updatedRequest = await MaterialRequest.findOneAndUpdate(
      { 
        $or: [
          { requestId: requestId },
          { _id: requestId }
        ]
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log(`✅ Updated material request ${requestId} to status: ${status}`);

    res.json({
      success: true,
      data: updatedRequest,
      message: `Material request successfully ${status}`
    });

  } catch (error) {
    console.error('❌ Error updating material request status:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

// Bulk Update Material Requests Status
const updateBulkMaterialRequestStatus = async (req, res) => {
  try {
    console.log("📦 BULK UPDATE STATUS - Body:", req.body);

    const { requestIds, status, approvedBy } = req.body;

    // Validate required fields
    if (!requestIds || !status) {
      return res.status(400).json({
        success: false,
        message: 'Request IDs and status are required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'assigned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, assigned'
      });
    }

    // Validate requestIds is an array
    const idsArray = Array.isArray(requestIds) ? requestIds : [requestIds];
    if (idsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request IDs must be a non-empty array'
      });
    }

    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Add approval metadata
    if (status === 'approved') {
      updateData.approvedBy = approvedBy || 'system';
      updateData.approvedAt = new Date();
      updateData.approvalType = approvedBy ? 'admin' : 'self';
    } else if (status === 'rejected') {
      updateData.rejectedBy = approvedBy || 'system';
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = req.body.rejectionReason || null;
    }

    // Update multiple requests
    const result = await MaterialRequest.updateMany(
      { 
        $or: [
          { requestId: { $in: idsArray } },
          { _id: { $in: idsArray } }
        ]
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No material requests found with the provided IDs'
      });
    }

    console.log(`✅ Updated ${result.modifiedCount} material request(s) to status: ${status}`);

    // Fetch updated requests
    const updatedRequests = await MaterialRequest.find({
      $or: [
        { requestId: { $in: idsArray } },
        { _id: { $in: idsArray } }
      ]
    });

    res.json({
      success: true,
      data: updatedRequests,
      message: `Successfully updated ${result.modifiedCount} request(s) to ${status} status`,
      stats: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('❌ Error updating bulk material request status:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

// Alternative Update Material Request Status (PUT)
const updateMaterialRequestStatusAlternative = async (req, res) => {
  try {
    console.log("🔄 ALTERNATIVE UPDATE - Body:", req.body);

    const { requestIds, status, approvedBy } = req.body;

    // Validate required fields
    if (!requestIds || !status) {
      return res.status(400).json({
        success: false,
        message: 'Request IDs and status are required'
      });
    }

    // Use the bulk update function for consistency
    const idsArray = Array.isArray(requestIds) ? requestIds : [requestIds];
    
    // Prepare update data
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'approved') {
      updateData.approvedBy = approvedBy || 'system';
      updateData.approvedAt = new Date();
      updateData.approvalType = approvedBy ? 'admin' : 'self';
    } else if (status === 'rejected') {
      updateData.rejectedBy = approvedBy || 'system';
      updateData.rejectedAt = new Date();
    }

    // Update multiple requests
    const result = await MaterialRequest.updateMany(
      { 
        $or: [
          { requestId: { $in: idsArray } },
          { _id: { $in: idsArray } }
        ]
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No material requests found with the provided IDs'
      });
    }

    console.log(`✅ Alternative update: ${result.modifiedCount} requests to ${status}`);

    res.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} request(s) to ${status} status`,
      stats: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('❌ Error in alternative update:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};




// Update Individual Material in a Request
const updateIndividualMaterial = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { materials, siteId, siteName, engineer, engineerEmail, requiredBy, priority } = req.body;

    console.log('📝 UPDATE INDIVIDUAL MATERIAL - Body:', req.body);
    console.log('📝 UPDATE INDIVIDUAL MATERIAL - Params:', req.params);

    // Validate required fields
    if (!requestId || !materials || !Array.isArray(materials)) {
      return res.status(400).json({
        success: false,
        message: 'Request ID and materials array are required'
      });
    }

    // Find the material request by _id or requestId
    const materialRequest = await MaterialRequest.findOne({
      $or: [
        { _id: requestId },
        { requestId: requestId }
      ]
    });

    if (!materialRequest) {
      return res.status(404).json({
        success: false,
        message: `Material request not found with ID: ${requestId}`
      });
    }

    // Check if request is in pending status (only pending requests can be edited)
    if (materialRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending material requests can be edited'
      });
    }

    // Validate materials array
    if (materials.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Materials array cannot be empty'
      });
    }

    // Validate each material
    for (let material of materials) {
      if (!material.materialType || !material.name || !material.quantity || !material.unit) {
        return res.status(400).json({
          success: false,
          message: 'All material fields (type, name, quantity, unit) are required'
        });
      }

      // Validate quantity is positive number
      if (material.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Material quantity must be greater than 0'
        });
      }

      // Validate material type
      const validMaterialTypes = ['civil', 'carpentry', 'plumbing', 'electrical', 'fabricator', 'others'];
      if (!validMaterialTypes.includes(material.materialType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid material type: ${material.materialType}`
        });
      }

      // Validate unit
      const validUnits = ['bags', 'kg', 'tons', 'liters', 'pieces', 'meter', 'feet', 'inches', 'cubicYards'];
      if (!validUnits.includes(material.unit)) {
        return res.status(400).json({
          success: false,
          message: `Invalid unit: ${material.unit}`
        });
      }
    }

    // Prepare updated materials with all fields
    const updatedMaterials = materials.map(material => ({
      materialType: material.materialType,
      name: material.name,
      materialBrand: material.materialBrand || '',
      quantity: Number(material.quantity),
      unit: material.unit,
      remarks: material.remarks || ''
    }));

    // Update the material request
    const updateData = {
      materials: updatedMaterials,
      updatedAt: new Date()
    };

    // Include other fields if provided (for full request update)
    if (siteId) updateData.siteId = siteId;
    if (siteName) updateData.siteName = siteName;
    if (engineer) updateData.engineer = engineer;
    if (engineerEmail) updateData.engineerEmail = engineerEmail;
    if (requiredBy) {
      const requiredByDate = new Date(requiredBy);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (requiredByDate < today) {
        return res.status(400).json({
          success: false,
          message: 'Required by date cannot be in the past'
        });
      }
      updateData.requiredBy = requiredByDate;
    }
    if (priority) updateData.priority = priority;

    const updatedRequest = await MaterialRequest.findByIdAndUpdate(
      materialRequest._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log(`✅ Updated individual material in request: ${materialRequest.requestId}`);

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Material updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating individual material:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(', ')}`
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};



// Delete Individual Material from a Request
const deleteIndividualMaterial = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { materialIndex, materialIdentifier } = req.body;

    console.log('🗑️ DELETE INDIVIDUAL MATERIAL - Body:', req.body);
    console.log('🗑️ DELETE INDIVIDUAL MATERIAL - Params:', req.params);

    // Validate required fields
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    if (materialIndex === undefined && !materialIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Either materialIndex or materialIdentifier is required to identify the material to delete'
      });
    }

    // Find the material request by _id or requestId
    const materialRequest = await MaterialRequest.findOne({
      $or: [
        { _id: requestId },
        { requestId: requestId }
      ]
    });

    if (!materialRequest) {
      return res.status(404).json({
        success: false,
        message: `Material request not found with ID: ${requestId}`
      });
    }

    // Check if request is in pending status (only pending requests can be modified)
    if (materialRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending material requests can be modified'
      });
    }

    // Check if there's more than one material (cannot delete the last material)
    if (materialRequest.materials.length <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last material in a request. Delete the entire request instead.'
      });
    }

    let materialToDeleteIndex = -1;

    // Find the material to delete
    if (materialIndex !== undefined) {
      // Delete by index
      if (materialIndex < 0 || materialIndex >= materialRequest.materials.length) {
        return res.status(400).json({
          success: false,
          message: `Invalid material index: ${materialIndex}`
        });
      }
      materialToDeleteIndex = materialIndex;
    } else if (materialIdentifier) {
      // Delete by identifier (name and type)
      materialToDeleteIndex = materialRequest.materials.findIndex(
        material => 
          material.name === materialIdentifier.name && 
          material.materialType === materialIdentifier.materialType
      );

      if (materialToDeleteIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Material not found in the request'
        });
      }
    }

    // Create new materials array without the deleted material
    const updatedMaterials = materialRequest.materials.filter(
      (_, index) => index !== materialToDeleteIndex
    );

    // Update the material request
    const updatedRequest = await MaterialRequest.findByIdAndUpdate(
      materialRequest._id,
      { 
        $set: { 
          materials: updatedMaterials,
          updatedAt: new Date()
        } 
      },
      { new: true, runValidators: true }
    );

    console.log(`✅ Deleted material from request: ${materialRequest.requestId}`);

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Material deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting individual material:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(', ')}`
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};



// Update Material Request (General PUT endpoint)
const updateMaterialRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const updateData = req.body;

    console.log('📝 UPDATE MATERIAL REQUEST - Body:', req.body);
    console.log('📝 UPDATE MATERIAL REQUEST - Params:', req.params);

    // Validate required fields
    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    // Find the material request by _id or requestId
    const materialRequest = await MaterialRequest.findOne({
      $or: [
        { _id: requestId },
        { requestId: requestId }
      ]
    });

    if (!materialRequest) {
      return res.status(404).json({
        success: false,
        message: `Material request not found with ID: ${requestId}`
      });
    }

    // Check if request is in pending status (only pending requests can be edited)
    if (materialRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending material requests can be edited'
      });
    }

    // Validate materials array if provided
    if (updateData.materials && Array.isArray(updateData.materials)) {
      if (updateData.materials.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Materials array cannot be empty'
        });
      }

      // Validate each material
      for (let material of updateData.materials) {
        if (!material.materialType || !material.name || !material.quantity || !material.unit) {
          return res.status(400).json({
            success: false,
            message: 'All material fields (type, name, quantity, unit) are required'
          });
        }

        if (material.quantity <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Material quantity must be greater than 0'
          });
        }

        const validMaterialTypes = ['civil', 'carpentry', 'plumbing', 'electrical', 'fabricator', 'others'];
        if (!validMaterialTypes.includes(material.materialType)) {
          return res.status(400).json({
            success: false,
            message: `Invalid material type: ${material.materialType}`
          });
        }

        const validUnits = ['bags', 'kg', 'tons', 'liters', 'pieces', 'meter', 'feet', 'inches', 'cubicYards'];
        if (!validUnits.includes(material.unit)) {
          return res.status(400).json({
            success: false,
            message: `Invalid unit: ${material.unit}`
          });
        }
      }

      // Prepare materials with proper formatting
      updateData.materials = updateData.materials.map(material => ({
        materialType: material.materialType,
        name: material.name,
        materialBrand: material.materialBrand || '',
        quantity: Number(material.quantity),
        unit: material.unit,
        remarks: material.remarks || ''
      }));
    }

    // Validate requiredBy date if provided
    if (updateData.requiredBy) {
      const requiredByDate = new Date(updateData.requiredBy);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (requiredByDate < today) {
        return res.status(400).json({
          success: false,
          message: 'Required by date cannot be in the past'
        });
      }
      updateData.requiredBy = requiredByDate;
    }

    // Add updated timestamp
    updateData.updatedAt = new Date();

    const updatedRequest = await MaterialRequest.findByIdAndUpdate(
      materialRequest._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log(`✅ Updated material request: ${materialRequest.requestId}`);

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Material request updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating material request:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(', ')}`
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};


module.exports = {
  createMaterialRequest,
  getAllMaterialRequests,
  getMaterialRequestsByEngineer,
  // updateMaterialRequestStatus,
  getMaterialMaster,
  countMaterialReqDoc,

  updateSingleMaterialRequestStatus,
  updateBulkMaterialRequestStatus,
  updateMaterialRequestStatusAlternative,
  updateIndividualMaterial,
  deleteIndividualMaterial,
  updateMaterialRequest
};


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
// const updateIndividualMaterial = async (req, res) => {
//   try {
//     const { requestId, materialIndex } = req.params;
//     const { materialType, name, materialBrand, quantity, unit, remarks } = req.body;

//     console.log('Received update material request:', {
//       requestId,
//       materialIndex,
//       updateData: req.body
//     });

//     // Validate required fields
//     if (!materialType || !name || !quantity || !unit) {
//       return res.status(400).json({
//         success: false,
//         message: 'All material fields (type, name, quantity, unit) are required'
//       });
//     }

//     // Validate quantity is positive number
//     if (quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Material quantity must be greater than 0'
//       });
//     }

//     // Find the material request
//     const materialRequest = await MaterialRequest.findById(requestId);
    
//     if (!materialRequest) {
//       return res.status(404).json({
//         success: false,
//         message: 'Material request not found'
//       });
//     }

//     // Check if request status is pending (only pending requests can be edited)
//     if (materialRequest.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Only materials in pending requests can be edited'
//       });
//     }

//     // Validate material index
//     const index = parseInt(materialIndex);
//     if (isNaN(index) || index < 0 || index >= materialRequest.materials.length) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid material index'
//       });
//     }

//     // Create updated material object
//     const updatedMaterial = {
//       materialType: materialType,
//       name: name,
//       materialBrand: materialBrand || '',
//       quantity: Number(quantity),
//       unit: unit,
//       remarks: remarks || ''
//     };

//     // Update the specific material in the array
//     materialRequest.materials[index] = updatedMaterial;

//     // Save the updated request
//     await materialRequest.save();

//     console.log('Material updated successfully:', {
//       requestId: materialRequest.requestId,
//       materialIndex: index,
//       materialName: name
//     });

//     res.status(200).json({
//       success: true,
//       data: materialRequest,
//       message: 'Material updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating individual material:', error);
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: `Validation error: ${errors.join(', ')}`
//       });
//     }

//     // Handle cast errors (invalid ObjectId)
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



// Update material request (for both update and delete operations)
const updateMaterialRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { 
      materials, 
      siteId, 
      siteName, 
      engineer, 
      engineerEmail, 
      requiredBy, 
      priority,
      operationType, // 'update' or 'delete'
      materialIndex, // for delete operations
      updatedMaterial // for update operations
    } = req.body;

    // Find the material request
    const materialRequest = await MaterialRequest.findById(requestId);
    
    if (!materialRequest) {
      return res.status(404).json({
        success: false,
        message: 'Material request not found'
      });
    }

    // If materials array is provided, update the entire request
    if (materials && Array.isArray(materials)) {
      materialRequest.materials = materials;
    } 
    // If operation type is specified, handle specific operations
    else if (operationType === 'delete' && materialIndex !== undefined) {
      // Delete specific material
      if (materialIndex >= 0 && materialIndex < materialRequest.materials.length) {
        materialRequest.materials.splice(materialIndex, 1);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid material index'
        });
      }
    }
    else if (operationType === 'update' && materialIndex !== undefined && updatedMaterial) {
      // Update specific material
      if (materialIndex >= 0 && materialIndex < materialRequest.materials.length) {
        materialRequest.materials[materialIndex] = {
          ...materialRequest.materials[materialIndex],
          ...updatedMaterial
        };
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid material index'
        });
      }
    }

    // Update other fields if provided
    if (siteId) materialRequest.siteId = siteId;
    if (siteName) materialRequest.siteName = siteName;
    if (engineer) materialRequest.engineer = engineer;
    if (engineerEmail) materialRequest.engineerEmail = engineerEmail;
    if (requiredBy) materialRequest.requiredBy = requiredBy;
    if (priority) materialRequest.priority = priority;

    // Save the updated request
    await materialRequest.save();

    res.status(200).json({
      success: true,
      message: 'Material request updated successfully',
      data: materialRequest
    });

  } catch (error) {
    console.error('Error updating material request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Individual Material from a Request
const deleteIndividualMaterial = async (req, res) => {
  try {
    const { requestId, materialIndex } = req.params;

    console.log('Received delete material request:', {
      requestId,
      materialIndex
    });

    // Find the material request
    const materialRequest = await MaterialRequest.findById(requestId);
    
    if (!materialRequest) {
      return res.status(404).json({
        success: false,
        message: 'Material request not found'
      });
    }

    // Check if request status is pending (only pending requests can be deleted)
    if (materialRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only materials in pending requests can be deleted'
      });
    }

    // Validate material index
    const index = parseInt(materialIndex);
    if (isNaN(index) || index < 0 || index >= materialRequest.materials.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material index'
      });
    }

    // Check if it's the last material in the request
    if (materialRequest.materials.length <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last material in a request. Delete the entire request instead.'
      });
    }

    // Get the material being deleted for logging
    const materialToDelete = materialRequest.materials[index];
    
    // Remove the specific material from the array
    materialRequest.materials.splice(index, 1);

    // Save the updated request
    await materialRequest.save();

    console.log('Material deleted successfully:', {
      requestId: materialRequest.requestId,
      materialIndex: index,
      materialName: materialToDelete.name
    });

    res.status(200).json({
      success: true,
      data: materialRequest,
      message: 'Material deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting individual material:', error);

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


module.exports = {
  createMaterialRequest,
  getAllMaterialRequests,
  getMaterialRequestsByEngineer,
  getMaterialMaster,
  countMaterialReqDoc,

  updateSingleMaterialRequestStatus,
  updateBulkMaterialRequestStatus,
  updateMaterialRequestStatusAlternative,
  // updateIndividualMaterial,
  updateMaterialRequest,
  deleteIndividualMaterial,

};
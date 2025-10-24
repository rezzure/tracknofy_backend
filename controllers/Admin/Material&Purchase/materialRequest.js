

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



// // Create Material Request - Modified for dual approval workflow
// const createMaterialRequest = async (req, res) => {
//   try {
//     const { siteId, siteName, engineer, engineerEmail, materials, requiredBy, priority, requestStatus } = req.body;

//     console.log('Received material request:', req.body);

//     // Validate required fields
//     if (!siteId || !siteName || !engineer || !engineerEmail || !requiredBy || !materials || materials.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'All required fields must be filled'
//       });
//     }

//     // Validate requiredBy date is not in the past
//     const requiredByDate = new Date(requiredBy);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
//     if (requiredByDate < today) {
//       return res.status(400).json({
//         success: false,
//         message: 'Required by date cannot be in the past'
//       });
//     }

//     // Validate materials array
//     for (let material of materials) {
//       if (!material.materialType || !material.name || !material.quantity || !material.unit) {
//         return res.status(400).json({
//           success: false,
//           message: 'All material fields (type, name, quantity, unit) are required'
//         });
//       }

//       // Validate quantity is positive number
//       if (material.quantity <= 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'Material quantity must be greater than 0'
//         });
//       }
//     }

//     // Generate request ID
//     const requestCount = await MaterialRequest.countDocuments();
//     const requestId = `REQ-${String(requestCount + 1).padStart(3, '0')}`;

//     // Prepare materials with all fields
//     const preparedMaterials = materials.map(material => ({
//       materialType: material.materialType,
//       name: material.name,
//       materialBrand: material.materialBrand || '',
//       quantity: Number(material.quantity),
//       unit: material.unit,
//       remarks: material.remarks || ''
//     }));

//     // Determine initial status based on who is creating the request
//     // If requestStatus is provided and valid, use it (for self-approval)
//     // Otherwise default to 'pending' for admin approval
//     let initialStatus = 'pending';
    
//     if (requestStatus && ['pending', 'approved'].includes(requestStatus)) {
//       initialStatus = requestStatus;
//     }

//     // Additional validation for self-approval
//     if (initialStatus === 'approved') {
//       // Check if user has permission to self-approve
//       // You might want to add role-based validation here
//       const userRole = req.user?.role; // Assuming user info is in req.user from auth middleware
      
//       if (userRole && userRole.toLowerCase() !== 'admin') {
//         // For non-admin users, you might want to add additional checks
//         // For example, only certain users can self-approve up to certain limits
//         console.log(`Self-approval requested by user: ${engineerEmail}`);
        
//         // You can add logic here to:
//         // 1. Check if user has self-approval permission
//         // 2. Validate quantity limits for self-approval
//         // 3. Log the self-approval action
//       }
//     }

//     const newRequest = new MaterialRequest({
//       requestId,
//       siteId,
//       siteName,
//       engineer,
//       engineerEmail: engineerEmail,
//       materials: preparedMaterials,
//       requiredBy: requiredByDate,
//       priority: priority || 'medium',
//       status: initialStatus,
//       // Add approval metadata
//       approvedBy: initialStatus === 'approved' ? engineerEmail : null,
//       approvedAt: initialStatus === 'approved' ? new Date() : null,
//       approvalType: initialStatus === 'approved' ? 'self' : 'pending_admin'
//     });

//     await newRequest.save();

//     console.log('Material request created successfully:', {
//       requestId: newRequest.requestId,
//       status: newRequest.status,
//       approvalType: newRequest.approvalType
//     });

//     res.status(201).json({
//       success: true,
//       data: newRequest,
//       message: initialStatus === 'approved' 
//         ? 'Material request submitted and approved successfully' 
//         : 'Material request submitted successfully and pending approval'
//     });
//   } catch (error) {
//     console.error('Error creating material request:', error);
    
//     // Handle duplicate requestId error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Request ID already exists. Please try again.'
//       });
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: `Validation error: ${errors.join(', ')}`
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error: ' + error.message
//     });
//   }
// };

// // Update Individual Material in a Request
// const updateIndividualMaterial = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const { materials, ...otherFields } = req.body;

//     console.log('Updating individual material in request:', requestId);
//     console.log('Received data:', { materials, otherFields });

//     // Validate request ID
//     if (!requestId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Request ID is required'
//       });
//     }

//     // Find the existing request
//     const existingRequest = await MaterialRequest.findOne({ 
//       $or: [
//         { requestId: requestId },
//         { _id: requestId }
//       ]
//     });

//     if (!existingRequest) {
//       return res.status(404).json({
//         success: false,
//         message: 'Material request not found'
//       });
//     }

//     // Validate that request is in pending status
//     if (existingRequest.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Only materials in pending requests can be edited'
//       });
//     }

//     // Validate materials array exists and is not empty
//     if (!materials || !Array.isArray(materials) || materials.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Materials array is required and cannot be empty'
//       });
//     }

//     // Validate each material in the updated array
//     for (let material of materials) {
//       if (!material.materialType || !material.name || !material.quantity || !material.unit) {
//         return res.status(400).json({
//           success: false,
//           message: 'All material fields (type, name, quantity, unit) are required'
//         });
//       }

//       // Validate quantity is positive number
//       if (material.quantity <= 0) {
//         return res.status(400).json({
//           success: false,
//           message: 'Material quantity must be greater than 0'
//         });
//       }

//       // Validate material type is from allowed options
//       const allowedMaterialTypes = ["civil", "carpentry", "plumbing", "electrical", "fabricator", "others"];
//       if (!allowedMaterialTypes.includes(material.materialType)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid material type. Allowed types: ${allowedMaterialTypes.join(', ')}`
//         });
//       }

//       // Validate unit is from allowed options
//       const allowedUnits = ["bags", "kg", "tons", "liters", "pieces", "meter", "feet", "inches", "cubicYards"];
//       if (!allowedUnits.includes(material.unit)) {
//         return res.status(400).json({
//           success: false,
//           message: `Invalid unit. Allowed units: ${allowedUnits.join(', ')}`
//         });
//       }
//     }

//     // Prepare updated materials with proper data types
//     const updatedMaterials = materials.map(material => ({
//       materialType: material.materialType,
//       name: material.name,
//       materialBrand: material.materialBrand || '',
//       quantity: Number(material.quantity),
//       unit: material.unit,
//       remarks: material.remarks || ''
//     }));

//     // Update the request with new materials and maintain other fields
//     const updatedRequest = await MaterialRequest.findOneAndUpdate(
//       { 
//         $or: [
//           { requestId: requestId },
//           { _id: requestId }
//         ],
//         status: 'pending' // Additional safety check
//       },
//       { 
//         $set: { 
//           materials: updatedMaterials,
//           updatedAt: new Date(),
//           ...otherFields // Include any other fields that might be updated
//         } 
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedRequest) {
//       return res.status(404).json({
//         success: false,
//         message: 'Material request not found or not in pending status'
//       });
//     }

//     console.log('Individual material updated successfully in request:', updatedRequest.requestId);

//     res.status(200).json({
//       success: true,
//       data: updatedRequest,
//       message: 'Material updated successfully'
//     });

//   } catch (error) {
//     console.error('Error updating individual material:', error);
    
//     // Handle duplicate key errors
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Duplicate request detected'
//       });
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: `Validation error: ${errors.join(', ')}`
//       });
//     }

//     // Handle CastError (invalid ID format)
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid request ID format'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while updating material: ' + error.message
//     });
//   }
// };


// // Delete Individual Material from a Request
// const deleteIndividualMaterial = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const { materialIndex, materialIdentifier } = req.body;

//     console.log('Deleting individual material from request:', requestId);
//     console.log('Material identifier:', { materialIndex, materialIdentifier });

//     // Validate request ID
//     if (!requestId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Request ID is required'
//       });
//     }

//     // Find the existing request
//     const existingRequest = await MaterialRequest.findOne({ 
//       $or: [
//         { requestId: requestId },
//         { _id: requestId }
//       ]
//     });

//     if (!existingRequest) {
//       return res.status(404).json({
//         success: false,
//         message: 'Material request not found'
//       });
//     }

//     // Validate that request is in pending status
//     if (existingRequest.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: 'Only materials in pending requests can be deleted'
//       });
//     }

//     // Validate materials array exists and has items
//     if (!existingRequest.materials || existingRequest.materials.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No materials found in this request'
//       });
//     }

//     // Prevent deleting the last material
//     if (existingRequest.materials.length <= 1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete the last material in a request. Delete the entire request instead.'
//       });
//     }

//     let updatedMaterials;

//     // Handle deletion by index
//     if (materialIndex !== undefined && materialIndex !== null) {
//       // Validate material index
//       if (materialIndex < 0 || materialIndex >= existingRequest.materials.length) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid material index'
//         });
//       }

//       // Remove material by index
//       updatedMaterials = existingRequest.materials.filter((_, index) => index !== materialIndex);
//     }
//     // Handle deletion by identifier (name and type)
//     else if (materialIdentifier) {
//       const { name, materialType } = materialIdentifier;
      
//       if (!name || !materialType) {
//         return res.status(400).json({
//           success: false,
//           message: 'Material name and type are required for identification'
//         });
//       }

//       // Find material to delete
//       const materialToDelete = existingRequest.materials.find(
//         material => material.name === name && material.materialType === materialType
//       );

//       if (!materialToDelete) {
//         return res.status(404).json({
//           success: false,
//           message: 'Material not found in the request'
//         });
//       }

//       // Remove material by identifier
//       updatedMaterials = existingRequest.materials.filter(
//         material => !(material.name === name && material.materialType === materialType)
//       );
//     }
//     else {
//       return res.status(400).json({
//         success: false,
//         message: 'Either materialIndex or materialIdentifier is required'
//       });
//     }

//     // Validate that we actually removed a material
//     if (updatedMaterials.length === existingRequest.materials.length) {
//       return res.status(400).json({
//         success: false,
//         message: 'No material was removed. Please check the provided identifier.'
//       });
//     }

//     // Update the request with filtered materials
//     const updatedRequest = await MaterialRequest.findOneAndUpdate(
//       { 
//         $or: [
//           { requestId: requestId },
//           { _id: requestId }
//         ],
//         status: 'pending' // Additional safety check
//       },
//       { 
//         $set: { 
//           materials: updatedMaterials,
//           updatedAt: new Date()
//         } 
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedRequest) {
//       return res.status(404).json({
//         success: false,
//         message: 'Material request not found or not in pending status'
//       });
//     }

//     console.log('Individual material deleted successfully from request:', updatedRequest.requestId);

//     res.status(200).json({
//       success: true,
//       data: updatedRequest,
//       message: 'Material deleted successfully'
//     });

//   } catch (error) {
//     console.error('Error deleting individual material:', error);
    
//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: `Validation error: ${errors.join(', ')}`
//       });
//     }

//     // Handle CastError (invalid ID format)
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid request ID format'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while deleting material: ' + error.message
//     });
//   }
// };

// In your material requests routes file
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


// // Update Material Request Status - For approval workflow
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


// Get Material Master Data
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



module.exports = {
  createMaterialRequest,
  getAllMaterialRequests,
  getMaterialRequestsByEngineer,
  // updateMaterialRequestStatus,
  getMaterialMaster,
  countMaterialReqDoc,

  updateSingleMaterialRequestStatus,
  updateBulkMaterialRequestStatus,
  updateMaterialRequestStatusAlternative
  // updateIndividualMaterial,
  // deleteIndividualMaterial
};
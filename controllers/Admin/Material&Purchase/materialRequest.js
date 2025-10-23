const MaterialMaster = require("../../../Schema/materialPurchase.Schema/materialMaster.model");
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");



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


// Update Material Request (for editing individual materials)
const updateMaterialRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteId, siteName, engineer, engineerEmail, materials, requiredBy, priority } = req.body;

    console.log('Updating material request ID:', id);
    console.log('Update data:', req.body);

    // Find the existing request by requestId or _id
    let existingRequest;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it's a valid MongoDB ObjectId, search by _id
      existingRequest = await MaterialRequest.findById(id);
    } else {
      // Otherwise search by requestId
      existingRequest = await MaterialRequest.findOne({ requestId: id });
    }

    if (!existingRequest) {
      return res.status(404).json({
        success: false,
        message: 'Material request not found'
      });
    }

    // Check if request is pending (only pending requests can be edited)
    if (existingRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending material requests can be edited'
      });
    }

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
    today.setHours(0, 0, 0, 0);
    
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

    // Prepare materials with all fields
    const preparedMaterials = materials.map(material => ({
      materialType: material.materialType,
      name: material.name,
      materialBrand: material.materialBrand || '',
      quantity: Number(material.quantity),
      unit: material.unit,
      remarks: material.remarks || ''
    }));

    // Update the request using the _id from the found request
    const updatedRequest = await MaterialRequest.findByIdAndUpdate(
      existingRequest._id,
      {
        siteId,
        siteName,
        engineer,
        engineerEmail,
        materials: preparedMaterials,
        requiredBy: requiredByDate,
        priority: priority || 'medium',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log('Material request updated successfully:', updatedRequest.requestId);

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: 'Material request updated successfully'
    });
  } catch (error) {
    console.error('Error updating material request:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${errors.join(', ')}`
      });
    }

    // Handle cast error (invalid ID)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid material request ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};


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
const updateMaterialRequestStatus = async (req, res) => {
  try {
    const { requestIds, status } = req.body;

    const result = await MaterialRequest.updateMany(
      { requestId: { $in: requestIds } },
      { $set: { status, updatedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      data: result,
      message: `Material requests ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating material requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

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

module.exports = {
  createMaterialRequest,
  getAllMaterialRequests,
  getMaterialRequestsByEngineer,
  updateMaterialRequestStatus,
  getMaterialMaster,
  countMaterialReqDoc,
  updateMaterialRequest
};
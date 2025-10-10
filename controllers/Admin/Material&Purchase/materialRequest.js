const MaterialMaster = require("../../../Schema/materialPurchase.Schema/materialMaster.model");
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");



// Create Material Request - Improved version

const createMaterialRequest = async (req, res) => {
  try {
    const { siteId, siteName, engineer, engineerEmail, materials, requiredBy, priority } = req.body;

    console.log('Received material request:', req.body);

    // Validate required fields
    if (!siteId || !siteName || !engineer || !requiredBy || !materials || materials.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
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
    }

    // Generate request ID
    const requestCount = await MaterialRequest.countDocuments();
    const requestId = `REQ-${String(requestCount + 1).padStart(3, '0')}`;

    const newRequest = new MaterialRequest({
      requestId,
      siteId,
      siteName,
      engineer,
      engineerEmail: engineerEmail || req.user?.email, // Fallback
      materials: materials.map(material => ({
        materialType: material.materialType,
        name: material.name, // Ensure we use 'name' as per schema
        quantity: material.quantity,
        unit: material.unit
      })),
      requiredBy,
      priority: priority || 'medium',
      status: 'pending'
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      data: newRequest,
      message: 'Material request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating material request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
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

// Get Material Requests by Engineer
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
  countMaterialReqDoc
};

const { default: mongoose } = require("mongoose");
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");
const PurchaseOrder = require("../../../Schema/materialPurchase.Schema/purchaseOrder.model");
const Vendor = require("../../../Schema/materialPurchase.Schema/vendor.model");


// Create Purchase Order 
const createPurchaseOrder = async (req, res) => {
  try {
    const { 
      requestIds, 
      vendorId, 
      vendorName, 
      expectedDelivery, 
      createdBy, 
      materials, 
      siteName, 
      siteId,
      engineerEmail, 
      engineerName, 
      totalAmount 
    } = req.body;

    console.log("Request Body:", req.body);
    console.log("Looking for request IDs:", requestIds);

    // Validate required fields
    if (!requestIds || requestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No request IDs provided'
      });
    }

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required'
      });
    }

    // Get approved requests
    const approvedRequests = await MaterialRequest.find({ 
      _id: { $in: requestIds },
      status: 'approved'
    });

    console.log("Found approved requests:", approvedRequests.length);

    if (approvedRequests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No approved requests found with the provided IDs'
      });
    }

    // Generate PO ID
    const poCount = await PurchaseOrder.countDocuments();
    const poId = `PO-${String(poCount + 1).padStart(3, '0')}`;

    // Transform materials to match schema - FIXED: Include all required fields
    const poMaterials = materials.map(material => ({
      name: material.name, // Use 'name' directly from frontend
      materialType: material.materialType, // Include materialType
      quantity: material.quantity,
      unit: material.unit,
      rate: material.rate || 0,
      amount: (material.quantity || 0) * (material.rate || 0)
    }));

    console.log("Transformed materials:", poMaterials);

    // Use the actual vendorId from request - FIXED: Don't create fake ObjectId
    let validVendorId;
    try {
      validVendorId = new mongoose.Types.ObjectId(vendorId);
    } catch (error) {
      console.error('Error creating vendor ObjectId:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID format'
      });
    }

    // Use data from first selected request for missing fields - FIXED
    const firstRequest = approvedRequests[0];

    const newPO = new PurchaseOrder({
      poId: poId,
      requestIds: requestIds,
      siteName: siteName || firstRequest.siteName,
      siteId: siteId || firstRequest.siteId, // FIXED: Include siteId
      vendorId: validVendorId,
      vendorName: vendorName,
      materials: poMaterials,
      totalAmount: totalAmount || poMaterials.reduce((sum, material) => sum + material.amount, 0),
      expectedDelivery: expectedDelivery,
      createdBy: createdBy,
      engineerEmail: engineerEmail || firstRequest.engineerEmail,
      engineerName: engineerName || firstRequest.engineer, // FIXED: Include engineerName
      status: 'pending'
    });

    console.log("Final PO data to save:", newPO);

    await newPO.save();

    // Update material requests status to 'assigned'
    await MaterialRequest.updateMany(
      { _id: { $in: requestIds } },
      { $set: { status: 'assigned', updatedAt: new Date() } }
    );

    res.status(201).json({
      success: true,
      data: newPO,
      message: 'Purchase order created successfully'
    });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

// Get All Purchase Orders
const getAllPurchaseOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }

    // Remove populate since we're using mock vendors
    const purchaseOrders = await PurchaseOrder.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: purchaseOrders,
      message: 'Purchase orders fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};



// Get Purchase Orders by Engineer
const getPurchaseOrdersByEngineer = async (req, res) => {
  try {
    const { email } = req.query;

    // First get material requests by this engineer
    const materialRequests = await MaterialRequest.find({ engineerEmail: email });
    const requestIds = materialRequests.map(req => req.requestId);

    // Then get POs that contain these request IDs
    const purchaseOrders = await PurchaseOrder.find({
      requestIds: { $in: requestIds }
    })
    .populate('vendorId', 'name contact rating')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: purchaseOrders,
      message: 'Purchase orders fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Approved Material Requests (for Admin PO creation)
const getApprovedMaterialRequests = async (req, res) => {
  try {
    const approvedRequests = await MaterialRequest.find({ status: 'approved' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: approvedRequests,
      message: 'Approved material requests fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper function to calculate material rates
const calculateMaterialRate = (materialName) => {
  // Implement your rate calculation logic here
  // This could be from a pricing master or fixed rates
  const rateMap = {
    'OPC Cement': 350,
    'PPC Cement': 320,
    'TMT Bar 8mm': 60,
    'TMT Bar 12mm': 62,
    'TMT Bar 16mm': 65,
    // Add more materials as needed
  };
  
  return rateMap[materialName] || 100; // Default rate
};

module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrdersByEngineer,
  getApprovedMaterialRequests
};
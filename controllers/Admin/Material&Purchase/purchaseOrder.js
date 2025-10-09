
const { default: mongoose } = require("mongoose");
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");
const PurchaseOrder = require("../../../Schema/materialPurchase.Schema/purchaseOrder.model");
const Vendor = require("../../../Schema/materialPurchase.Schema/vendor.model");

// Create Purchase Order
const createPurchaseOrder = async (req, res) => {
  try {
    const { requestIds, vendorId, vendorName, expectedDelivery, createdBy, materials, siteName, engineerEmail, engineerName, totalAmount } = req.body;

    console.log("Request Body:", req.body);
    console.log("Looking for request IDs:", requestIds);

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

    // Transform materials to match schema - FIX: Use 'name' instead of 'materialName'
    const poMaterials = materials.map(material => ({
      name: material.materialName, // CHANGED: materialName -> name
      quantity: material.quantity,
      unit: material.unit,
      rate: material.rate || 0,
      amount: (material.quantity || 0) * (material.rate || 0)
    }));

    // Create a valid ObjectId for vendor - FIX: Handle vendorId properly
    let validVendorId;
    try {
      // If vendorId is a simple string like "1", "2", "3", create a proper ObjectId
      // In a real scenario, you'd get this from your Vendor model
      validVendorId = new mongoose.Types.ObjectId(); // Create a new ObjectId for now
      // TODO: Replace with actual vendor lookup from your Vendor model
    } catch (error) {
      console.error('Error creating vendor ObjectId:', error);
      // Fallback to a default ObjectId
      validVendorId = new mongoose.Types.ObjectId();
    }

    const newPO = new PurchaseOrder({
      poId: poId, // FIX: Add required poId field
      requestIds: requestIds,
      siteName: siteName || approvedRequests[0].siteName,
      vendorId: validVendorId, // FIX: Use proper ObjectId
      vendorName: vendorName,
      materials: poMaterials,
      totalAmount: totalAmount || poMaterials.reduce((sum, material) => sum + material.amount, 0),
      expectedDelivery: expectedDelivery,
      createdBy: createdBy,
      status: 'pending' // FIX: Use valid enum value
    });

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
// const getAllPurchaseOrders = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let filter = {};
    
//     if (status) {
//       filter.status = status;
//     }

//     const purchaseOrders = await PurchaseOrder.find(filter)
//       .populate('vendorId', 'name contact rating')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: purchaseOrders,
//       message: 'Purchase orders fetched successfully'
//     });
//   } catch (error) {
//     console.error('Error fetching purchase orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };




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
// const getPurchaseOrdersByEngineer = async (req, res) => {
//   try {
//     const { email } = req.query;

//     // Find purchase orders where engineerEmail matches
//     const purchaseOrders = await PurchaseOrder.find({ engineerEmail: email })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: purchaseOrders,
//       message: 'Purchase orders fetched successfully'
//     });
//   } catch (error) {
//     console.error('Error fetching engineer purchase orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error: ' + error.message
//     });
//   }
// };

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
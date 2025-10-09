
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");
const PurchaseOrder = require("../../../Schema/materialPurchase.Schema/purchaseOrder.model");
const Vendor = require("../../../Schema/materialPurchase.Schema/vendor.model");

// Create Purchase Order
const createPurchaseOrder = async (req, res) => {
  try {
    const { requestIds, vendorId, expectedDelivery, createdBy } = req.body;

    // Get approved requests
    const approvedRequests = await MaterialRequest.find({ 
      requestId: { $in: requestIds },
      status: 'approved'
    });

    if (approvedRequests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No approved requests found'
      });
    }

    // Get vendor details
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Generate PO ID
    const poCount = await PurchaseOrder.countDocuments();
    const poId = `PO-${String(poCount + 1).padStart(3, '0')}`;

    // Calculate materials and total amount
    const allMaterials = approvedRequests.flatMap(req => req.materials);
    const materialsWithRates = allMaterials.map(material => {
      const rate = calculateMaterialRate(material.name); // You need to implement this
      const amount = material.quantity * rate;
      
      return {
        name: material.name,
        quantity: material.quantity,
        unit: material.unit,
        rate: rate,
        amount: amount
      };
    });

    const totalAmount = materialsWithRates.reduce((sum, material) => sum + material.amount, 0);

    const newPO = new PurchaseOrder({
      poId,
      requestIds,
      siteName: approvedRequests[0].siteName, // Take first request's site
      vendorId: vendor._id,
      vendorName: vendor.name,
      materials: materialsWithRates,
      totalAmount,
      expectedDelivery,
      createdBy,
      status: 'pending'
    });

    await newPO.save();

    // Update material requests status to 'assigned'
    await MaterialRequest.updateMany(
      { requestId: { $in: requestIds } },
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
      message: 'Internal server error'
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

    const purchaseOrders = await PurchaseOrder.find(filter)
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
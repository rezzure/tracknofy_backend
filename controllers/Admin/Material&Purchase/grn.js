
const GRN = require("../../../Schema/materialPurchase.Schema/grn.model");
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");
const PurchaseOrder = require("../../../Schema/materialPurchase.Schema/purchaseOrder.model");

// Create GRN
const createGRN = async (req, res) => {
  try {
    const { purchaseOrderId, materials, receivedBy, notes } = req.body;

    // Get purchase order
    const purchaseOrder = await PurchaseOrder.findOne({ poId: purchaseOrderId });
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    // Validate delivered quantities
    const grnMaterials = materials.map(deliveredMaterial => {
      const orderedMaterial = purchaseOrder.materials.find(
        m => m.name === deliveredMaterial.name
      );
      
      if (!orderedMaterial) {
        throw new Error(`Material ${deliveredMaterial.name} not found in purchase order`);
      }

      if (deliveredMaterial.deliveredQuantity > orderedMaterial.quantity) {
        throw new Error(`Delivered quantity for ${deliveredMaterial.name} exceeds ordered quantity`);
      }

      return {
        name: deliveredMaterial.name,
        orderedQuantity: orderedMaterial.quantity,
        deliveredQuantity: deliveredMaterial.deliveredQuantity,
        unit: orderedMaterial.unit
      };
    });

    // Determine GRN status
    const isFullyDelivered = grnMaterials.every(
      material => material.deliveredQuantity === material.orderedQuantity
    );
    const status = isFullyDelivered ? 'delivered' : 'partial';

    // Generate GRN ID
    const grnCount = await GRN.countDocuments();
    const grnId = `GRN-${String(grnCount + 1).padStart(3, '0')}`;

    const newGRN = new GRN({
      grnId,
      purchaseOrderId,
      siteName: purchaseOrder.siteName,
      vendorName: purchaseOrder.vendorName,
      materials: grnMaterials,
      receivedBy,
      status,
      notes
    });

    await newGRN.save();

    // Update purchase order status if fully delivered
    if (isFullyDelivered) {
      await PurchaseOrder.findOneAndUpdate(
        { poId: purchaseOrderId },
        { $set: { status: 'delivered' } }
      );
    }

    res.status(201).json({
      success: true,
      data: newGRN,
      message: 'GRN created successfully'
    });
  } catch (error) {
    console.error('Error creating GRN:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Get Pending Deliveries
const getPendingDeliveries = async (req, res) => {
  try {
    const { email } = req.query;

    let filter = { status: { $in: ['pending', 'approved'] } };

    // If supervisor, only show their site's POs
    if (email) {
      const materialRequests = await MaterialRequest.find({ engineerEmail: email });
      const requestIds = materialRequests.map(req => req.requestId);

      const purchaseOrders = await PurchaseOrder.find({
        requestIds: { $in: requestIds },
        status: { $in: ['pending', 'approved'] }
      });

      const pendingDeliveries = purchaseOrders.map(po => ({
        id: po.poId,
        purchaseOrderId: po.poId,
        siteName: po.siteName,
        vendor: po.vendorName,
        materials: po.materials.map(material => ({
          name: material.name,
          quantity: material.quantity,
          unit: material.unit,
          delivered: 0
        })),
        expectedDelivery: po.expectedDelivery,
        status: po.status
      }));

      return res.status(200).json({
        success: true,
        data: pendingDeliveries,
        message: 'Pending deliveries fetched successfully'
      });
    }

    // Admin view - all pending deliveries
    const purchaseOrders = await PurchaseOrder.find(filter).sort({ expectedDelivery: 1 });

    const pendingDeliveries = purchaseOrders.map(po => ({
      id: po.poId,
      purchaseOrderId: po.poId,
      siteName: po.siteName,
      vendor: po.vendorName,
      materials: po.materials.map(material => ({
        name: material.name,
        quantity: material.quantity,
        unit: material.unit,
        delivered: 0
      })),
      expectedDelivery: po.expectedDelivery,
      status: po.status
    }));

    res.status(200).json({
      success: true,
      data: pendingDeliveries,
      message: 'Pending deliveries fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get GRN History
const getGRNHistory = async (req, res) => {
  try {
    const { email } = req.query;

    let filter = {};

    // If supervisor, only show their site's GRNs
    if (email) {
      const materialRequests = await MaterialRequest.find({ engineerEmail: email });
      const requestIds = materialRequests.map(req => req.requestId);

      const purchaseOrders = await PurchaseOrder.find({
        requestIds: { $in: requestIds }
      });
      const poIds = purchaseOrders.map(po => po.poId);

      filter.purchaseOrderId = { $in: poIds };
    }

    const grnHistory = await GRN.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: grnHistory,
      message: 'GRN history fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching GRN history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All GRNs (Admin)
const getAllGRNs = async (req, res) => {
  try {
    const grns = await GRN.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: grns,
      message: 'All GRNs fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching GRNs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createGRN,
  getPendingDeliveries,
  getGRNHistory,
  getAllGRNs
};

const GRN = require("../../../Schema/materialPurchase.Schema/grn.model");
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");
const PurchaseOrder = require("../../../Schema/materialPurchase.Schema/purchaseOrder.model");


// Create GRN - FIXED VERSION
const createGRN = async (req, res) => {
  try {
    const { purchaseOrderId, materials, receivedBy, notes, engineerEmail } = req.body;

    console.log("GRN Creation Request:", { 
      purchaseOrderId, 
      materials, 
      receivedBy,
      engineerEmail 
    });

    // Find purchase order by MongoDB _id
    const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
    if (!purchaseOrder) {
      console.log("Purchase order not found for ID:", purchaseOrderId);
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    console.log("Found Purchase Order:", purchaseOrder.poId);
    console.log("PO Materials:", purchaseOrder.materials);

    // Validate delivered quantities and prepare GRN materials
    const grnMaterials = [];
    
    for (const deliveredMaterial of materials) {
      // Find the corresponding material in purchase order
      const orderedMaterial = purchaseOrder.materials.find(
        m => m.name === deliveredMaterial.materialName
      );
      
      if (!orderedMaterial) {
        console.log("Material not found in PO:", deliveredMaterial.materialName);
        console.log("Available materials in PO:", purchaseOrder.materials.map(m => m.name));
        return res.status(400).json({
          success: false,
          message: `Material "${deliveredMaterial.materialName}" not found in purchase order`
        });
      }

      if (deliveredMaterial.deliveredQuantity > orderedMaterial.quantity) {
        return res.status(400).json({
          success: false,
          message: `Delivered quantity for ${deliveredMaterial.materialName} exceeds ordered quantity`
        });
      }

      grnMaterials.push({
        name: deliveredMaterial.materialName,
        materialType: deliveredMaterial.materialType || orderedMaterial.materialType || 'General',
        orderedQuantity: orderedMaterial.quantity,
        deliveredQuantity: deliveredMaterial.deliveredQuantity,
        unit: orderedMaterial.unit,
        rate: orderedMaterial.rate || 0
      });
    }

    // Calculate total amount
    const totalAmount = grnMaterials.reduce((total, material) => {
      return total + (material.deliveredQuantity * material.rate);
    }, 0);

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
      purchaseOrderId: purchaseOrder.poId, // Store the string PO ID
      originalPurchaseOrderId: purchaseOrderId, // Store the MongoDB _id
      siteName: purchaseOrder.siteName,
      vendorName: purchaseOrder.vendorName,
      materials: grnMaterials,
      totalAmount,
      receivedBy,
      engineerEmail: engineerEmail || purchaseOrder.engineerEmail,
      status,
      notes: notes || `GRN created for ${purchaseOrder.poId}`
    });

    await newGRN.save();
    console.log("GRN created successfully:", newGRN.grnId);

    // Update purchase order status
    const newPOStatus = isFullyDelivered ? 'delivered' : 'partial';
    await PurchaseOrder.findByIdAndUpdate(
      purchaseOrderId,
      { $set: { status: newPOStatus } }
    );
    console.log("Purchase order status updated to:", newPOStatus);

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


// // Get GRN History
// const getGRNHistory = async (req, res) => {
//   try {
//     const { email } = req.query;

//     let filter = {};

//     // If supervisor, only show their site's GRNs
//     if (email) {
//       const materialRequests = await MaterialRequest.find({ engineerEmail: email });
//       const requestIds = materialRequests.map(req => req.requestId);

//       const purchaseOrders = await PurchaseOrder.find({
//         requestIds: { $in: requestIds }
//       });
//       const poIds = purchaseOrders.map(po => po.poId);

//       filter.purchaseOrderId = { $in: poIds };
//     }

//     const grnHistory = await GRN.find(filter).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: grnHistory,
//       message: 'GRN history fetched successfully'
//     });
//   } catch (error) {
//     console.error('Error fetching GRN history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// Get GRN History - Enhanced Version
const getGRNHistory = async (req, res) => {
  try {
    const { email } = req.query;

    let filter = {};

    if (email) {
      console.log('Fetching GRN history for email:', email);
      
      // Try multiple approaches to find user's GRNs
      
      // Approach 1: Direct filter by engineerEmail in GRN
      const grnsByEmail = await GRN.find({ engineerEmail: email });
      if (grnsByEmail.length > 0) {
        filter.engineerEmail = email;
      } else {
        // Approach 2: Find via purchase orders
        const purchaseOrders = await PurchaseOrder.find({ 
          $or: [
            { engineerEmail: email },
            { createdByEmail: email }
          ]
        });
        
        const poIds = purchaseOrders.map(po => po._id);
        console.log('Found purchase orders:', poIds);
        
        if (poIds.length > 0) {
          filter.purchaseOrderId = { $in: poIds };
        } else {
          // Approach 3: Find via material requests
          const materialRequests = await MaterialRequest.find({ 
            engineerEmail: email 
          });
          const requestIds = materialRequests.map(req => req._id);
          
          const purchaseOrdersFromRequests = await PurchaseOrder.find({
            requestIds: { $in: requestIds }
          });
          const poIdsFromRequests = purchaseOrdersFromRequests.map(po => po._id);
          
          if (poIdsFromRequests.length > 0) {
            filter.purchaseOrderId = { $in: poIdsFromRequests };
          }
        }
      }
    }

    console.log('GRN filter:', filter);
    const grnHistory = await GRN.find(filter).sort({ createdAt: -1 });
    console.log('Found GRN history:', grnHistory.length);

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


// Get Pending Deliveries - FIXED VERSION
const getPendingDeliveries = async (req, res) => {
  try {
    const { email } = req.query;
    console.log("email", email)

    let filter = { status: { $in: ['pending', 'approved'] } };

    if (email) {
      // For supervisor - get POs based on their material requests
      const purchaseOrders = await PurchaseOrder.find({
        engineerEmail: email,
        status: { $in: ['pending', 'approved'] }
      }).sort({ expectedDelivery: 1 });

      const pendingDeliveries = purchaseOrders.map(po => ({
        _id: po._id, // Include MongoDB _id for GRN creation
        poId: po.poId,
        poNumber: po.poId,
        siteName: po.siteName,
        vendorName: po.vendorName,
        materials: po.materials.map(material => ({
          materialName: material.name,
          materialType: material.materialType || 'General', // Add fallback
          quantity: material.quantity,
          unit: material.unit,
          rate: material.rate || 0,
          delivered: 0 // Initialize delivered quantity
        })),
        expectedDelivery: po.expectedDelivery,
        status: po.status,
        engineerEmail: po.engineerEmail
      }));

      return res.status(200).json({
        success: true,
        data: pendingDeliveries
      });
    }

    // Admin view - all pending deliveries
    const purchaseOrders = await PurchaseOrder.find(filter).sort({ expectedDelivery: 1 });

    const pendingDeliveries = purchaseOrders.map(po => ({
      _id: po._id,
      poId: po.poId,
      poNumber: po.poId,
      siteName: po.siteName,
      vendorName: po.vendorName,
      materials: po.materials.map(material => ({
        materialName: material.name,
        materialType: material.materialType || 'General',
        quantity: material.quantity,
        unit: material.unit,
        rate: material.rate || 0,
        delivered: 0
      })),
      expectedDelivery: po.expectedDelivery,
      status: po.status,
      engineerEmail: po.engineerEmail
    }));

    res.status(200).json({
      success: true,
      data: pendingDeliveries
    });
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
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
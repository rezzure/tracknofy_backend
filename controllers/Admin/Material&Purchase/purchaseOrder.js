
const { default: mongoose } = require("mongoose");
const MaterialRequest = require("../../../Schema/materialPurchase.Schema/materialRequest.model");
const PurchaseOrder = require("../../../Schema/materialPurchase.Schema/purchaseOrder.model");
const Vendor = require("../../../Schema/materialPurchase.Schema/vendor.model");


// // Create Purchase Order 
// const createPurchaseOrder = async (req, res) => {
//   try {
//     const { 
//       requestIds, 
//       vendorId, 
//       vendorName, 
//       expectedDelivery, 
//       createdBy, 
//       materials, 
//       siteName, 
//       siteId,
//       engineerEmail, 
//       engineerName, 
//       totalAmount 
//     } = req.body;

//     console.log("Request Body:", req.body);
//     console.log("Looking for request IDs:", requestIds);

//     // Validate required fields
//     if (!requestIds || requestIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No request IDs provided'
//       });
//     }

//     if (!vendorId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Vendor ID is required'
//       });
//     }

//     // Get approved requests
//     const approvedRequests = await MaterialRequest.find({ 
//       _id: { $in: requestIds },
//       status: 'approved'
//     });

//     console.log("Found approved requests:", approvedRequests.length);

//     if (approvedRequests.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No approved requests found with the provided IDs'
//       });
//     }

//     // Generate PO ID
//     const poCount = await PurchaseOrder.countDocuments();
//     const poId = `PO-${String(poCount + 1).padStart(3, '0')}`;


//     // Transform materials to match schema - FIXED: Include all required fields
//     const poMaterials = materials.map(material => ({
//       name: material.name, // Use 'name' directly from frontend
//       materialType: material.materialType, // Include materialType
//       quantity: material.quantity,
//       unit: material.unit,
//       rate: material.rate || 0,
//       amount: (material.quantity || 0) * (material.rate || 0)
//     }));

//     console.log("Transformed materials:", poMaterials);

//     // Use the actual vendorId from request - FIXED: Don't create fake ObjectId
//     let validVendorId;
//     try {
//       validVendorId = new mongoose.Types.ObjectId(vendorId);
//     } catch (error) {
//       console.error('Error creating vendor ObjectId:', error);
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid vendor ID format'
//       });
//     }

//     // Use data from first selected request for missing fields - FIXED
//     const firstRequest = approvedRequests[0];

//     const newPO = new PurchaseOrder({
//       poId: poId,
//       requestIds: requestIds,
//       siteName: siteName || firstRequest.siteName,
//       siteId: siteId || firstRequest.siteId, // FIXED: Include siteId
//       vendorId: validVendorId,
//       vendorName: vendorName,
//       materials: poMaterials,
//       totalAmount: totalAmount || poMaterials.reduce((sum, material) => sum + material.amount, 0),
//       expectedDelivery: expectedDelivery,
//       createdBy: createdBy,
//       engineerEmail: engineerEmail || firstRequest.engineerEmail,
//       engineerName: engineerName || firstRequest.engineer, // FIXED: Include engineerName
//       status: 'pending'
//     });

//     console.log("Final PO data to save:", newPO);

//     await newPO.save();

//     // Update material requests status to 'assigned'
//     await MaterialRequest.updateMany(
//       { _id: { $in: requestIds } },
//       { $set: { status: 'assigned', updatedAt: new Date() } }
//     );

//     res.status(201).json({
//       success: true,
//       data: newPO,
//       message: 'Purchase order created successfully'
//     });
//   } catch (error) {
//     console.error('Error creating purchase order:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error: ' + error.message
//     });
//   }
// };

// Create Purchase Order - COMPLETELY FIXED VERSION
const createPurchaseOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { 
      requestIds, 
      materialIndices, // Object with requestId as key and array of indices as value
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
    console.log("Material indices to process:", materialIndices);

    // Validate required fields
    if (!requestIds || requestIds.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'No request IDs provided'
      });
    }

    if (!vendorId || !vendorName) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Vendor ID and name are required'
      });
    }

    if (!materialIndices || Object.keys(materialIndices).length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'No materials selected for PO creation'
      });
    }

    // Get approved requests
    const approvedRequests = await MaterialRequest.find({ 
      _id: { $in: requestIds },
      status: 'approved'
    }).session(session);

    console.log("Found approved requests:", approvedRequests.length);

    if (approvedRequests.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'No approved requests found with the provided IDs'
      });
    }

    // Validate that all requested materials exist and are available
    for (const request of approvedRequests) {
      const requestId = request._id.toString();
      const indicesToProcess = materialIndices[requestId] || [];
      
      if (indicesToProcess.length > 0) {
        for (const index of indicesToProcess) {
          if (!request.materials || index >= request.materials.length) {
            await session.abortTransaction();
            return res.status(400).json({
              success: false,
              message: `Material index ${index} not found in request ${request.requestId}`
            });
          }
        }
      }
    }

    // Generate PO ID
    const poCount = await PurchaseOrder.countDocuments();
    const poId = `PO-${String(poCount + 1).padStart(3, '0')}`;

    // Transform materials to match schema
    const poMaterials = materials.map(material => ({
      name: material.name,
      materialType: material.materialType,
      materialBrand: material.materialBrand,
      quantity: material.quantity,
      unit: material.unit,
      rate: material.rate || 0,
      amount: (material.quantity || 0) * (material.rate || 0),
      remarks: material.remarks || ''
    }));

    console.log("Transformed materials:", poMaterials);

    // Use the actual vendorId from request
    let validVendorId;
    try {
      validVendorId = new mongoose.Types.ObjectId(vendorId);
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating vendor ObjectId:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID format'
      });
    }

    // Use data from first selected request for missing fields
    const firstRequest = approvedRequests[0];

    const newPO = new PurchaseOrder({
      poId: poId,
      requestIds: requestIds,
      siteName: siteName || firstRequest.siteName,
      siteId: siteId || firstRequest.siteId,
      vendorId: validVendorId,
      vendorName: vendorName,
      materials: poMaterials,
      totalAmount: totalAmount || poMaterials.reduce((sum, material) => sum + material.amount, 0),
      expectedDelivery: expectedDelivery,
      createdBy: createdBy,
      engineerEmail: engineerEmail || firstRequest.engineerEmail,
      engineerName: engineerName || firstRequest.engineer,
      status: 'pending'
    });

    console.log("Final PO data to save:", newPO);

    await newPO.save({ session });

    // FIXED: Update material requests - remove only processed materials, keep unprocessed ones
    const updatePromises = approvedRequests.map(async (request) => {
      const requestId = request._id.toString();
      const indicesToRemove = materialIndices[requestId] || [];
      
      if (indicesToRemove.length > 0) {
        console.log(`Processing request ${request.requestId}: removing indices`, indicesToRemove);
        
        // Remove only the selected materials (keep unselected ones)
        const updatedMaterials = request.materials.filter((_, index) => 
          !indicesToRemove.includes(index)
        );
        
        console.log(`Original materials count: ${request.materials.length}, After removal: ${updatedMaterials.length}`);
        
        // Update the request with remaining materials
        // Status remains 'approved' as long as there are materials left
        const updateData = {
          materials: updatedMaterials,
          updatedAt: new Date()
        };
        
        // Only change status to 'assigned' if ALL materials are processed
        if (updatedMaterials.length === 0) {
          updateData.status = 'assigned';
          console.log(`All materials processed for request ${request.requestId}, marking as assigned`);
        } else {
          console.log(`${updatedMaterials.length} materials remain for request ${request.requestId}, keeping as approved`);
        }
        
        return MaterialRequest.findByIdAndUpdate(
          requestId,
          updateData,
          { new: true, session }
        );
      }
      
      return Promise.resolve(request); // No changes if no materials selected from this request
    });

    await Promise.all(updatePromises);

    // Commit the transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: newPO,
      message: 'Purchase order created successfully'
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  } finally {
    session.endSession();
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




const getPurchaseOrdersByEngineer = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Fetching POs for engineer email:', email);

    // FIX: Look for purchase orders by engineerEmail directly
    const purchaseOrders = await PurchaseOrder.find({ 
      engineerEmail: email 
    })
    .populate('vendorId', 'name contact rating')
    .sort({ createdAt: -1 });

    console.log('Found POs:', purchaseOrders.length);

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
// const getApprovedMaterialRequests = async (req, res) => {
//   try {
//     const approvedRequests = await MaterialRequest.find({ status: 'approved' }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: approvedRequests,
//       message: 'Approved material requests fetched successfully'
//     });
//   } catch (error) {
//     console.error('Error fetching approved requests:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };


// Get Approved Material Requests - FIXED VERSION
const getApprovedMaterialRequests = async (req, res) => {
  try {
    // FIXED: Remove the materials filtering - show ALL approved requests
    const approvedRequests = await MaterialRequest.find({ 
      status: 'approved'
    }).sort({ createdAt: -1 });

    console.log(`Found ${approvedRequests.length} approved requests`);

    res.status(200).json({
      success: true,
      data: approvedRequests, // Return ALL approved requests
      message: 'Approved material requests fetched successfully',
      count: approvedRequests.length
    });
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get Approved Material Requests By Engineer - FIXED VERSION
const getApprovedMaterialRequestsByEngineer = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Engineer email is required'
      });
    }

    // FIXED: Remove the materials filtering - show ALL approved requests for engineer
    const approvedRequests = await MaterialRequest.find({ 
      engineerEmail: email,
      status: 'approved'
    }).sort({ createdAt: -1 });

    console.log(`Found ${approvedRequests.length} approved requests for engineer ${email}`);

    res.status(200).json({
      success: true,
      data: approvedRequests, // Return ALL approved requests
      message: `Approved material requests for engineer ${email} fetched successfully`,
      count: approvedRequests.length
    });

  } catch (error) {
    console.error('Error fetching approved requests by engineer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching approved requests'
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


// // Get Approved Material Requests By Engineer - FIXED VERSION
// const getApprovedMaterialRequestsByEngineer = async (req, res) => {
//   try {
//     const { email } = req.query;

//     // Validate email parameter
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Engineer email is required'
//       });
//     }

//     // FIXED: Only fetch approved requests that have materials remaining for the specific engineer
//     const approvedRequests = await MaterialRequest.find({ 
//       engineerEmail: email,
//       status: 'approved',
//       'materials.0': { $exists: true } // Only requests with at least 1 material
//     }).sort({ createdAt: -1 });

//     console.log(`Found ${approvedRequests.length} approved requests with materials for engineer ${email}`);

//     // Additional filtering to ensure no empty material arrays
//     const requestsWithMaterials = approvedRequests.filter(request => 
//       request.materials && request.materials.length > 0
//     );

//     console.log(`After filtering: ${requestsWithMaterials.length} requests with actual materials for engineer ${email}`);

//     res.status(200).json({
//       success: true,
//       data: requestsWithMaterials,
//       message: `Approved material requests with materials for engineer ${email} fetched successfully`,
//       count: requestsWithMaterials.length
//     });

//   } catch (error) {
//     console.error('Error fetching approved requests by engineer:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while fetching approved requests'
//     });
//   }
// };


module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrdersByEngineer,
  getApprovedMaterialRequests,
  getApprovedMaterialRequestsByEngineer
};
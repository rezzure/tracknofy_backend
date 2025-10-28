// routes/materialRoutes.js
const express = require('express');
const { createMaterialRequest, getAllMaterialRequests, getMaterialRequestsByEngineer, countMaterialReqDoc, updateSingleMaterialRequestStatus, deleteIndividualMaterial, updateMaterialRequest } = require('../../controllers/Admin/Material&Purchase/materialRequest');
const getAssignUserSite = require('../../controllers/Admin/Material&Purchase/getAssignUserSite');
const { getApprovedMaterialRequests, getPurchaseOrdersByEngineer, createPurchaseOrder, getAllPurchaseOrders, getApprovedMaterialRequestsByEngineer } = require('../../controllers/Admin/Material&Purchase/purchaseOrder');
const { createGRN, getPendingDeliveries, getGRNHistory, getAllGRNs } = require('../../controllers/Admin/Material&Purchase/grn');
const router = express.Router();



// Material Request Routes

router.post('/material-requests', createMaterialRequest);
router.get('/material-requests', getAllMaterialRequests);
router.get('/material-requests/engineer', getMaterialRequestsByEngineer);
// router.patch('/material-requests/status', updateMaterialRequestStatus);



// Add these routes to your existing router
router.patch('/material-requests/:requestId/status', updateSingleMaterialRequestStatus);





// router.get('/material-master', getMaterialMaster);
router.get('/get/assignUserSite', getAssignUserSite)
router.get('/material-requests/count', countMaterialReqDoc)



 // Individual material management routes(wrong end-point doest not match route frontend and backend)
// router.patch('/material-requests/:requestId/materials/:materialIndex', updateIndividualMaterial);
// router.delete('/material-requests/:requestId/materials/:materialIndex', deleteIndividualMaterial);


router.put('/material-requests/:requestId', updateMaterialRequest);
router.put('/material-requests/:requestId', deleteIndividualMaterial);



router.post('/purchase-orders', createPurchaseOrder);
router.get('/purchase-orders', getAllPurchaseOrders);
router.get('/purchase-orders/engineer', getPurchaseOrdersByEngineer);
router.get('/approved-requests', getApprovedMaterialRequests);

// For supervisors to get their approved requests for PO creation
router.get('/approved-requests/engineer', getApprovedMaterialRequestsByEngineer);


// // GRN Routes
router.post('/grn', createGRN);
router.get('/pending-deliveries', getPendingDeliveries);
router.get('/grn-history', getGRNHistory);
router.get('/grns', getAllGRNs);



module.exports = router;



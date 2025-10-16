const express = require('express');
const router = express.Router();
const manualQuotationController = require('../../controllers/manualQuotationController/manualQuotation');
const verification = require('../../middleware/verification');

// Manual Quotation Routes
router.post('/manual-quotation/create', manualQuotationController.createManualQuotation);
router.get('/manual-quotation/all', verification, manualQuotationController.getAllManualQuotations);
router.get('/manual-quotation/client', verification, manualQuotationController.getClientQuotations);
router.get('/manual-quotation/:id', verification, manualQuotationController.getManualQuotationById);

// NEW: Approve quotation route
router.patch('/manual-quotation/:id/approve', verification, manualQuotationController.approveQuotation);

// NEW: Archive quotation route
router.patch('/manual-quotation/:id/archive', verification, manualQuotationController.archiveQuotation);

router.put('/manual-quotation/:id', verification, manualQuotationController.updateManualQuotation);
router.delete('/manual-quotation/:id', verification, manualQuotationController.deleteManualQuotation);
router.patch('/manual-quotation/:id/status', verification, manualQuotationController.updateQuotationStatus);
router.put('/manual-quotation/:id/client-status', verification, manualQuotationController.updateQuotationStatusByClient);

// NEW ROUTE: Mark as version 1
router.patch('/manual-quotation/:id/mark-version-one', verification, manualQuotationController.markAsVersionOne);

// User Assignment Routes
router.patch('/manual-quotation/:id/assign-user', verification, manualQuotationController.assignUserToQuotation);
router.patch('/manual-quotation/:id/remove-assigned-user', verification, manualQuotationController.removeAssignedUser);

// Versioning Routes
router.post('/manual-quotation/:id/create-revision', verification, manualQuotationController.createRevision);
router.get('/manual-quotation/:id/versions', verification, manualQuotationController.getQuotationVersions);
router.get('/manual-quotation/:id/version/:versionNumber', verification, manualQuotationController.getQuotationVersion);

module.exports = router;
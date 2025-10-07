const express = require('express');
const router = express.Router();
const manualQuotationController = require('../../controllers/manualQuotationController/manualQuotation');
const verification = require('../../middleware/verification');

// Apply auth middleware to all routes
// router.use(authMiddleware);

// Manual Quotation Routes
router.post('/manual-quotation/create',verification, manualQuotationController.createManualQuotation);
router.get('/manual-quotation/all',verification, manualQuotationController.getAllManualQuotations);
router.get('/manual-quotation/:id',verification, manualQuotationController.getManualQuotationById);
router.put('/manual-quotation/:id',verification, manualQuotationController.updateManualQuotation);
router.delete('/manual-quotation/:id',verification, manualQuotationController.deleteManualQuotation);
router.patch('/manual-quotation/:id/status',verification, manualQuotationController.updateQuotationStatus);

module.exports = router;
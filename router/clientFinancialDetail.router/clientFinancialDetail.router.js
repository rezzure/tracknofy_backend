const express = require("express");
const router = express.Router();
const {
  createFinancialDetail,
  getFinancialDetails,
  editFinancialDetail,
  deleteFinancialDetail,
  getFinancialDetailById
} = require("../../controllers/clientFinancialDetailController/clientFinancialDetailController");

// Middleware (assuming you have authentication middleware)
// const authMiddleware = require("../../middleware/authMiddleware"); // Adjust path as per your project

// Apply auth middleware to all routes
// router.use(authMiddleware);

// Create financial detail
router.post("/create/financial-detail", createFinancialDetail);

// Get all financial details
router.get("/get/financial-details", getFinancialDetails);

// Get single financial detail by ID
router.get("/get/financial-detail/:id", getFinancialDetailById);

// Update financial detail
router.put("/edit/financial-detail/:id", editFinancialDetail);

// Delete financial detail
router.delete("/delete/financial-detail/:id", deleteFinancialDetail);

module.exports = router;
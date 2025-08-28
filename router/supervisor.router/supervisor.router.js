const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");
const verification = require("../../middleware/verification");
const supervisorDetail = require("../../controllers/Supervisor/supervisorDetail");
const getExpenseDetail = require("../../controllers/Supervisor/getExpenseDetail");
const expenseDetail = require("../../controllers/Supervisor/expenseDetail");
const progressReport = require("../../controllers/Supervisor/progressReport");
const getProgressReport = require("../../controllers/Supervisor/getProgressReport");
const addMaterialMaster = require("../../controllers/Supervisor/addMaterialMaster");
const addVendorManagement = require("../../controllers/Supervisor/addVendor");
const getMaterialMaster = require("../../controllers/Supervisor/getMaterialMaster");
const updateMaterialMaster = require("../../controllers/Supervisor/updateMaterialMaster");
const deleteMaterialMaster = require("../../controllers/Supervisor/deleteMaterialMaster");
const getVendorDetail = require("../../controllers/Supervisor/getVendorDetail");
const updateVendorDetail = require("../../controllers/Supervisor/updateVendorDetail");
const deleteVendorDetail = require("../../controllers/Supervisor/deleteVendorDetail");
const addPartnerManagement = require("../../controllers/Supervisor/addPartnerManagement");
const getPartnerDetail = require("../../controllers/Supervisor/getPartnerDetail");
const updatePartnerDetail = require("../../controllers/Supervisor/updatePartnerDetail");
const deletePartnerDetail = require("../../controllers/Supervisor/deletePartnerDetail");
const allotedSite = require("../../controllers/Supervisor/allotedSite");
 
// get detail
router.get("/supervisor/detail",verification,supervisorDetail)

// router to get allorted site
router.get("/allortedSite",verification,allotedSite)

// router for expense approval
router.post("/expense/detail",verification,upload.single('image'),expenseDetail)

// router to get expense details
router.get("/getExpense/details/:_id",verification,getExpenseDetail)

// router for progress report
router.post("/report/progress/:id",verification,upload.array("photos"),progressReport)

// getting progress report details
router.get("/getProgress/report/:_id",verification,getProgressReport)

// materialmaster router
router.post("/material/master", verification, addMaterialMaster)

// get material master detail
router.get("/get/material/master", verification, getMaterialMaster)

// Update material master
router.put("/update/material/master/:_id", verification, updateMaterialMaster)

// delete material master
router.delete("/delete/material/master/:_id", verification, deleteMaterialMaster)

// vendor management router
router.post("/vendor/management", verification, addVendorManagement)

// get vendor data router
router.get("/get/vendorDetail", verification, getVendorDetail)

// update vendor detail router
router.put("/update/vendorDetail/:_id", verification, updateVendorDetail)

// delete vendor detail router
router.delete("/delete/vendorDetail/:_id", deleteVendorDetail)

// partner Management router

router.post("/sup/add/partnerManagement",verification,upload.fields([
    { name: 'partnerPhoto', maxCount: 1 },
    { name: 'partnerIdProof', maxCount: 1 }
  ]),addPartnerManagement)

  // get partner Details router
router.get("/sup/get/partnerDetail", verification, getPartnerDetail)

  // update partner Details router
router.put("/sup/edit/partnerDetail/:_id" ,verification,upload.fields([{ name: 'partnerPhoto', maxCount: 1 },{ name: 'partnerIdProof', maxCount: 1 }]),updatePartnerDetail)

// delete partner detail rounter
router.delete("/sup/delete/partnerDetail/:_id", verification, deletePartnerDetail)

module.exports = router;
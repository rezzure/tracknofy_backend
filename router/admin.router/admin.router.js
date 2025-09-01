const express = require("express");
const router = express.Router();

require("dotenv").config();
const verification=require("../../middleware/verification.js");

const addRole = require ("../../controllers/Admin/addRole.js");
const adminDetail = require ("../../controllers/Admin/adminDetail.js");
const createUser = require ("../../controllers/Admin/createUser.js");
const getUsers = require ("../../controllers/Admin/getUsers.js");
const editUser = require ("../../controllers/Admin/editUser.js");
const getAdminDetail = require ("../../controllers/Admin/getAdminDetail.js");
const deleteUser = require ("../../controllers/Admin/deleteUser.js");
const getClientDetails = require ("../../controllers/Admin/getClientDetail.js");
const addSite = require ("../../controllers/Admin/addSite.js");
const getSupervisorDetail = require ("../../controllers/Admin/supervisorDetails.js");
const editSiteDetail = require ("../../controllers/Admin/editSiteDetail.js");
const getSiteDetail = require ("../../controllers/Admin/getSiteDetail.js");
const deleteSite = require ("../../controllers/Admin/deleteSite.js");
const getExpense = require ("../../controllers/Admin/getExpense.js");
const updateExpenseStatus = require ("../../controllers/Admin/updateExpenseStatus.js");
const getPaymentDetail = require ("../../controllers/Admin/getPaymentDetail.js");
const paymentApproval = require ("../../controllers/Admin/paymentApproval.js");
const disbursement = require ("../../controllers/Admin/disbursement.js");
const addFeature = require ("../../controllers/Admin/addFeature.js");
const addMaterialMaster = require("../../controllers/Admin/materialMaster.js");
const addVendorManagement = require("../../controllers/Admin/vendorManagement.js");
const getMaterialMaster = require("../../controllers/Admin/getMaterialMaster.js");
const updateMaterialMaster = require("../../controllers/Admin/updateMaterialMaster.js");
const deleteMaterialMaster = require("../../controllers/Admin/deleteMaterialMaster.js");
const getVendorDetail = require("../../controllers/Admin/getVendorDetail.js");
const updateVendorDetail = require("../../controllers/Admin/updateVendorDetail.js");
const deleteVendorDetail = require("../../controllers/Admin/deleteVendorDetail.js");
const addPartnerManagement = require("../../controllers/Admin/addPartnerManagement.js");
const getPartnerDetail = require("../../controllers/Admin/getPartnerDetail.js");
const updatePartnerDetail = require("../../controllers/Admin/updatePartnerDetail.js");
const deletePartnerDetail = require("../../controllers/Admin/deletePartnerDetail.js");
const allocateFund = require("../../controllers/Admin/fundAllocation.js");
const getAllotedAmountData = require("../../controllers/Admin/getAllotedAmountData.js");
const upload = require("../../middleware/multer.js");
const checkAdminExist = require("../../controllers/Admin/adminExists.js");
const getLedgerData = require("../../controllers/Admin/getLedgerData.js");
const addMasterType = require("../../controllers/Admin/addMasterType.js");



// admin details
router.get("/admin/detail",verification,adminDetail)

// router for add role
router.post("/add/role" ,verification,addRole)

//router to create user
router.post("/create/user",verification, createUser);

// router for getting user list
router.get("/get/users",verification, getUsers);

// editUser
router.put("/edit/user/:id",verification,editUser)

// delete user from collection
router.delete("/delete/user/:id",verification,deleteUser)

// router for getting admin detail
router.get("/admin/detail",verification,getAdminDetail)

// router to get clients detail
router.get("/client/detail",verification, getClientDetails);

//  router to get supervisors detail
router.get("/supervisor/details",verification, getSupervisorDetail);

// router for site details
router.post("/add/site",verification, addSite);

// getting site details
router.get("/get/sitesdetail",verification,getSiteDetail)

// edit site details
router.put("/edit/site/:id",verification, editSiteDetail)

// deleting site
router.delete("/delete/site/:id",verification,deleteSite)

// router for getting pending expenses detail from expenses collection
router.get("/getExpense/detail", verification,getExpense);

//router for expense approval
router.post("/updateExpenseStatus", verification,updateExpenseStatus);

//router for getting payment details which is from clients
router.get("/getPayment/detail", verification,getPaymentDetail);

// router for approving payment from client
router.post("/payment/approval", verification, paymentApproval);

// router for fund allocation to supervisor
router.post("/disbursement", verification, allocateFund);

// get disbursed amount data
router.get("/get/allortedFund",verification,getAllotedAmountData)

// additional features
router.post("/add/feature", verification, addFeature)

// materialmaster router
router.post("/material/master", verification, upload.single('materialPhoto'), addMaterialMaster )

// get material master detail
router.get("/get/material/master", verification, getMaterialMaster)

// Update material master
router.put("/update/material/master/:_id", verification, upload.single('materialPhoto'), updateMaterialMaster)

// delete material master
router.delete("/delete/material/master/:_id", verification, deleteMaterialMaster)

// vendor management router
router.post("/vendor/management", verification, addVendorManagement)

// get vendor detail router
router.get("/get/vendorDetail", verification, getVendorDetail)

// update vendor detail router
router.put("/update/vendorDetail/:_id", verification, updateVendorDetail)

// delete vendor detail router
router.delete("/delete/vendorDetail/:_id", verification, deleteVendorDetail)

// partner Management router
router.post("/add/partnerManagement",verification,upload.fields([{ name: 'partnerPhoto', maxCount: 1 },{ name: 'partnerIdProof', maxCount: 1 }]),addPartnerManagement)

// get partner details router
router.get("/get/partnerDetail", verification, getPartnerDetail)

// edit partner details router
router.put("/edit/partnerDetail/:_id" ,verification,upload.fields([{ name: 'partnerPhoto', maxCount: 1 },{ name: 'partnerIdProof', maxCount: 1 }]),updatePartnerDetail)

// delete partner detail rounter
router.delete("/delete/partnerDetail/:_id", verification, deletePartnerDetail)

// checking admin exists
// checkAdminExist
// /api/auth/check-admin
router.get('/auth/check-admin', checkAdminExist)

// get ledger detail
router.get("/get/ledgerData", verification , getLedgerData)


// add master type
router.post("/add/master/type", verification, addMasterType)

// get master type
router.get("/get/master/type", verification,)

// update master type
router.put("update/master/type/:_id", verification,)

// delete master type
router.delete("/delete/master/type/:_id", verification, )


// add data dictiionary
router.post("/add/data/dictionary", verification, )

// get data dictionary
router.get("/get/data/dictionary", verification, )

// update data dictionary
router.put("/update/data/dictionary/:_id", verification, )

// delete data dictionary
router.delete("/delete/data/dictionary/:_id", verification, )


module.exports = router;

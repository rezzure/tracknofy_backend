const express = require("express");
const router = express.Router();
const verification = require('../../middleware/verification.js');
const createClientPayment = require("../../controllers/Client/clientPayment.js");
const upload = require("../../middleware/multer.js");
const getClientPayments = require("../../controllers/Client/getClientPayment.js");
const getClientDetails = require("../../controllers/Client/getClientDetail.js");
const getProgressReport = require("../../controllers/Client/getProgressReport.js");
const getLastPayment = require("../../controllers/Client/getLastPayment.js");
const getSupervisorDetail = require("../../controllers/Client/getSupervisorDetail.js");
const {
  getClientDesigns,
  handleClientAction,
  addClientComment,
  getClientDesignDetails,
  getClientStats,
  getClientDesignVersions
} = require('../../controllers/Client/designApproval.js');

// Add these new routes to your client routes
router.get("/client/designs", verification, getClientDesigns);
router.get("/client/design/:designId/versions", verification, getClientDesignVersions);
router.patch("/design/:id/client-action", verification, handleClientAction);
router.get("/client/design/:id", verification, getClientDesignDetails);
router.post("/client/design/:id/comment", verification, addClientComment);
router.get("/client/stats", verification, getClientStats);

// router for getting client detail
router.get('/get/clientDetail',verification,getClientDetails)

// router for client payments
router.post("/client/payments", verification,upload.single('proofDocument'), createClientPayment)

// router for getting client payments
router.get("/getClient/payments",verification,getClientPayments)

// router for getting last payment
router.get("/get/LastPayment", verification, getLastPayment)

// router for progress report
router.get("/progress/report",verification,getProgressReport)

// router for showing supervisor detail to client
router.get("/get/supervisorDetail", verification, getSupervisorDetail)


// Add to your server routes
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router



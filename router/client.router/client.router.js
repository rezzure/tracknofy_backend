const express = require("express");
const router = express.Router();
// const Client = require("../../Schema/client.schema/client.model.js");
const Payments = require("../../Schema/recivedPayments.Schema/payment.model.js");
// const Site = require("../../Schema/site.Schema/site.model.js");
// const Progress = require("../../Schema/progressReport.schema/progressReport.model.js");
const verification = require('../../middleware/verification.js');
const createClientPayment = require("../../controllers/Client/clientPayment.js");
const upload = require("../../middleware/multer.js");
const getClientPayments = require("../../controllers/Client/getClientPayment.js");
const getClientDetails = require("../../controllers/Client/getClientDetail.js");
const getProgressReport = require("../../controllers/Client/getProgressReport.js");

router.get('/get/clientDetail',verification,getClientDetails)


router.post("/client/payments", verification,upload.single('proofDocument'), createClientPayment)

router.get("/getClient/payments",verification,getClientPayments)

// router for progress report
router.get("/progress/report",verification,getProgressReport)

// router for 

module.exports = router



const express = require ('express')
const verification = require('../../middleware/verification')
const router = express.Router()
const {getInvoice,saveInvoice,deleteInvoice,updateInvoice}= require("../../controllers/billingInvoiceController/billingInvoiceController")

router.get("/get/invoice",verification,getInvoice)
router.post("/save/invoice",verification,saveInvoice)
router.delete("/delete/invoice",verification,deleteInvoice)
router.put("/update/invoice",verification,updateInvoice)

module.exports = router
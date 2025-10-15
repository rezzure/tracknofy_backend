const express = require ('express')
const verification = require('../../middleware/verification')
const router = express.Router()
const {getInvoice,addInvoice,deleteInvoice,updateBillingInvoice}= require("../../controllers/billingInvoiceController/billingInvoiceController")

router.get("/get/invoice",verification,getInvoice)
router.post("/save/invoice",verification,addInvoice)
router.delete("/delete/invoice",verification,deleteInvoice)
router.put("/update/invoice",verification,updateBillingInvoice)

module.exports = router
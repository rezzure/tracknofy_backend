const express = require("express");
const router = express.Router();

const { upload } = require("../../middleware/queryMiddleware/uploadMiddleware");
const {addCompanies, getCompanies , updateCompany}= require("../../controllers/SuperAdmin/manageCompany");






// router.post("/add-companies", addCompany)
// Routes
router.post('/add-companies', upload.single('companyLogo'), addCompanies);
router.get('/get-companies', getCompanies);
router.put('/add-companies/:id', upload.single('companyLogo'), updateCompany);

module.exports=router;

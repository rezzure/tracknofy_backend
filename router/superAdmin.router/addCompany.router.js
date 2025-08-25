const express = require("express");
const router = express.Router();


const {addCompanies, getCompanies , updateCompany, updateCompanyStatus}= require("../../controllers/SuperAdmin/manageCompany");
const upload = require("../../middleware/superAdmin/uploadLogoMiddleware");









// router.post("/add-companies", addCompany)
// Routes
router.post('/add-companies', upload.single('companyLogo'), addCompanies);
router.get('/get-companies', getCompanies);
router.put('/add-companies/:id', upload.single('companyLogo'), updateCompany);
router.put('/update-company-status/:id', updateCompanyStatus)




module.exports=router;

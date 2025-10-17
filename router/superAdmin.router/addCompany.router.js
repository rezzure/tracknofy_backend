const express = require("express");
const router = express.Router();


const {getCompanies , updateCompanyStatus, updateCompany, addCompany }= require("../../controllers/SuperAdmin/manageCompany");
const upload = require("../../middleware/superAdmin/uploadLogoMiddleware");



// router.post("/add-companies", addCompany)
// Routes
router.post('/add-company', upload.single('companyLogo'), addCompany);
router.get('/get-companies', getCompanies);
router.put('/update-company/:id', upload.single('companyLogo'),  updateCompany);
router.put('/update-company-status/:id', updateCompanyStatus)



module.exports=router;

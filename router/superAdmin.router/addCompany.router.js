const express = require("express");
const router = express.Router();
const addCompany = require("../../controllers/SuperAdmin/addCompany");




router.post("/add-company", addCompany)

module.exports=router;


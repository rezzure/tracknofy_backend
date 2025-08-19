const express = require('express');
const User = require("../../Schema/users.schema/users.model")
const Admin = require("../../Schema/admin.schema/admine.model")
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config()
const secretCode = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

// admin signup
router.post("/auth/signup", async(req,res)=>{
  const { name, email,password,mobile,role} =req.body;
  try {
    const admin = await Admin.find();
    console.log(admin)
    if(admin.length<0){
      return res.send({
        success:false,
        message:"invalid request"
      })
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt)
    const data = new Admin({
      name:name,
      email:email,
      password:hashPassword,
      mobile:mobile,
      role:role
    })
    await data.save();

     const data1 = new User({
      name:name,
      email:email,
      password:hashPassword,
      mobile:mobile,
      role:role
    })
    await data1.save();

    return res.status(200).send({
      success:true,
      message:"SignUp success...",
      data:data,
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:"error:- "+error.message,
    })
  }
})

// login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body
 try{
   let user = await User.findOne({ email:email });

  if (!user) {
    return res.send({
      success: false,
      message: "user not found signup first",
    })
  }
  if (!password || !user.password) {
    return res.send({
      success: false,
      message: "Password missing or user has no password stored",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send({
      success: false,
      message: "wrong password",
    })
  }

  const data = {
    id: user._id
  }

  const token = jwt.sign(data, secretCode);
  user.password = ""
  return res.status(200).send({
    success: true,
    message: "user logged in successfully",
    token: token,
    data: user,
  })
 }
 catch(error){
  return res.status(500).send({
    success:false,
    message:"error:- "+error.message
  })
 }

})

module.exports = router;

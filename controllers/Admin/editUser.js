const Admin = require("../../Schema/admin.schema/admine.model")
const Client = require("../../Schema/client.schema/client.model")
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")
const User = require("../../Schema/users.schema/users.model")

const bcrypt = require("bcrypt");


const editUser = async(req,res)=>{
  const {id} =req.params
  const {name,email,mobile,password,role} = req.body
  try {
    const user1 = await User.findById(id)
    if(!user1){
      return res.status(404).send({
        success:false,
        message:"User Not Found"
      })
    }
    if(user1.role === "admin"){
      const admin = await Admin.findOne({email:user1.email})
      console.log(admin)
      if(name) admin.name=name
      if(email) admin.email = email
      if(mobile) admin.mobile = mobile
      if(password){
      let salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);
      admin.password=hashPassword
      
    }
    await admin.save()
    }
    if(user1.role === "client"){
      const client = await Client.findOne({email:user1.email})
      console.log(client)
      if(name) client.name=name
      if(email) client.email = email
      if(mobile) client.mobile = mobile
      if(password){
      let salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);
      client.password=hashPassword
      }
      await client.save()
    }

    if(user1.role === "supervisor"){
      const supervisor = await Supervisor.findOne({email:user1.email})
      console.log(supervisor)
      if(name) supervisor.name=name
      if(email) supervisor.email = email
      if(mobile) supervisor.mobile = mobile
      if(password){
      let salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);
      supervisor.password=hashPassword
      }
      await supervisor.save()
    }


    if(name) user1.name=name
    if(email) user1.email=email
    if(mobile) user1.mobile=mobile
    if(password){
      let salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);
      user1.password=hashPassword
    }
     await user1.save()

    res.status(200).send({
      success:true,
      message:"User Details Updated",
      data:user1
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      message:`Internal Server Error:- ${error.message}`
    })
  }
}

module.exports=editUser
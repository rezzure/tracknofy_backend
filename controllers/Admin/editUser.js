const Admin = require("../../Schema/admin.schema/admine.model")
const Client = require("../../Schema/client.schema/client.model")
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")
const User = require("../../Schema/users.schema/users.model")


const editUser = async(req,res)=>{
  const {id} =req.params
  const {name,email,mobile,password,role} = req.body
  try {
    const user1 = await User.findById(id)
    if(!user1){
      return res.status(404).send({
        success:false,
        message:"user not found"
      })
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
      message:"user Details updated",
      data:user1
    })
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"Error:- "+error.message
    })
  }
}

module.exports=editUser
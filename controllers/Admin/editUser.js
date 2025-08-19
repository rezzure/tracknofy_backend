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
    if(role) user1.role = role
   

    if(role){
      if(user1.role === "admin"){
        if(role === "admin"){
          const user = await Admin.findOne({email:email})
          if(name) user.name=user1.name
          if(email) user.email=user1.email
          if(mobile) user.mobile=user1.mobile
          await user.save()
        }
        if(role === "client"){
         await Admin.findOneAndDelete({email:email})
         const clientData = {
          email:user1.email,
          name:user1.name
         }
         await Client.create(clientData)
        }
        if(role === "supervisor"){
         await Admin.findOneAndDelete({email:email})
         const supervisorData = {
          email:user1.email,
          name:user1.name,
          mobile:user1.mobile
         }
         await Supervisor.create(supervisorData)
        }
      }
      else if(user1.role === "supervisor"){
        if(role === "supervisor"){
          const user = await Supervisor.findOne({email:email})
          if(name) user.name=user1.name
          if(email) user.email=user1.email
          if(mobile) user.mobile = user1.mobile
          await user.save()

        }
        if(role === "admin"){
        await Supervisor.findOneAndDelete({email:email})
          const adminData = {
            name:user1.name,
            email:user1.email,
            mobile:user1.mobile
          }
          await Admin.create(adminData)
        }
        if(role === "client"){
         await Supervisor.findOneAndDelete({email:email})
          const clientData = {
            name:user1.name,
            email:user1.email
          }
          await Client.create(clientData)
        }
      }
      else{
        if(role ==="client"){
          const user = await Client.findOne({email:email})
          if(email) user.email=user1.email
          if(name) user.name=user1.name
          await user.save()
        }
        if(role === "admin"){
          await Client.findOneAndDelete({email:email})
          const adminData = {
            email:user1.email,
            name:user1.name,
            mobile:user1.mobile
          }
          await Admin.create(adminData)
        }
        if(role === "supervisor"){
          await Client.findOneAndDelete({email:email})
          const supervisorData = {
            email:user1.email,
            name:user1.name,
            mobile:user1.mobile
          }
          await Supervisor.create(supervisorData)
        }
      }
    }
     await user1.save()
    console.log(user1)
    // if(role === "admin") await Admin.create(user)
    // if(role === "client") await Client.create(user)
    // if(role === "supervisor") await Supervisor.create(user)

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
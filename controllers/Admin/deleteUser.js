const Admin = require("../../Schema/admin.schema/admine.model");
const Client = require("../../Schema/client.schema/client.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");
const User = require("../../Schema/users.schema/users.model");


const deleteUser = async(req,res)=>{
  try{
    const {id} = req.params;
    console.log(id)
    const data = await User.findByIdAndDelete({_id:id})
    if(data.role === "admin"){
      await Admin.findOneAndDelete({email:data.email})
    }else if(data.role === "supervisor"){
      await Supervisor.findOneAndDelete({email:data.email})
    }
    else{
      await Client.findOneAndDelete({email:data.email})
    }
    return res.status(200).send({
        success:true,
        message:"user deleted...",
      })
  }
  catch(error){
    return res.status(500).send({
      success:false,
      message:"Error: -"+error.message
    })
  }
}
module.exports=deleteUser
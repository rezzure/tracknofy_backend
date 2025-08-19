const Role = require("../../Schema/addRole.schema/addRole.model");
const Admin = require("../../Schema/admin.schema/admine.model");

const addRole = async (req, res) => {
  const {roleName,description,isActive,adminId} = req.body
  try{
    const role = await Role.findOne({roleName:roleName});
    const admin = await Admin.findById({_id:adminId})
    if(role || !admin){
      return res.send({
        success:true,
        message:"either role already exists or admin not found"
      })
    }
    const data = new Role({
      roleName:roleName,
      description:description,
      isActive:isActive,
      createdBy:adminId
    })
    await data.save();
    return res.status(200).send({
      success:true,
      message:"new role created..."
    })
    
  }
  catch(err){
    return res.status(500).send({
      success:true,
      message:"error :- "+err.message,
    })
  }
}
module.exports=addRole
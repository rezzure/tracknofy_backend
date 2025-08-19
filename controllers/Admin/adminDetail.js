const Admin = require("../../Schema/admin.schema/admine.model")

const adminDetail = async(req,res)=>{
   const email = req.query.email;
  try{
    const adminData = await Admin.findOne({email:email})
    if(!adminData){
      return res.send({
        success:false,
        message:"admin not found"
      })
    }
    return res.status(200).send({
      success:true,
      message:"data fetched",
      data:adminData
    })
  }
  catch(error){
    return res.status(500).send({
      success:false,
      message:"error:- "+error.message
    })
  }
}
module.exports=adminDetail
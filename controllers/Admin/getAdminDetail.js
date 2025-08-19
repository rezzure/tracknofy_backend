const Admin = require("../../Schema/admin.schema/admine.model")




const getAdminDetail = async(req,res)=>{
  try {
    const admin = await Admin.find();
    console.log(admin)
    if(!admin || !admin.length === 0){
      return res.send({
        success:false,
        message:"no admin data found !!!"
      })
    }
    res.status(200).send({
      success:true,
      message:"admin list found"
    })

  } catch (error) {
    return res.status(500).send({
      success:false,
      message:"Error:- "+error.message
    })
  }
}
module.exports=getAdminDetail
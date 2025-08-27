const Site = require("../../Schema/site.Schema/site.model");


const getSiteDetail = async(req,res)=>{
  try {
    const sites = await Site.find();
    if(sites.length<=0){
      return res.status(404).send({
        success:false,
        message:"No Site Found"
      })
    }
    return res.status(200).send({
      success:true,
      message:"Site Data Found",
      data:sites
    })

  } catch (error) {
    return res.status(500).send({
      success:true,
      message:"Internal Server Error:- "+error.message
    })
  }
}
module.exports=getSiteDetail
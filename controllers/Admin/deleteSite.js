const Site = require("../../Schema/site.Schema/site.model");

const deleteSite = async(req,res)=>{
  const {id} = req.params;
  console.log(id)
  try {
    const sitedata = await Site.findByIdAndDelete(id)
    if(!sitedata){
      return res.status(404).send({
        success:false,
        message:"site not found"
      })
    }

    return res.status(200).send({
      success:true,
      message:"site deleted...",
      data:sitedata
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:`Error:- ${error}`
    })
  }
}

module.exports=deleteSite
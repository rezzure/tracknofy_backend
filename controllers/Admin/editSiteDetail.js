const Site = require("../../Schema/site.Schema/site.model");
const User = require("../../Schema/users.schema/users.model");

const editSiteDetail = async (req,res)=>{
  const {id} = req.params;
  const {name, address,client,supervisor} = req.body;
  console.log(name, address,client,supervisor)
  try{
    const siteData = await Site.findById(id)
    const supervisorData = await User.findOne({email:supervisor})
    const clientData = await User.findOne({email:client})

    if(!siteData){
      return res.status(404).send({
        success:false,
        message:"Site data not found"
      })
    }
    if(name) siteData.name = name;
    if(address) siteData.address = address;
    if(client){
      siteData.clientName = clientData.name;
      siteData.clientId = clientData._id 
    }
    if(supervisor){
      siteData.supervisorName = supervisorData.name
      siteData.supervisorId = supervisorData._id
    }
    await siteData.save()
    return res.status(200).send({
      success:true,
      message:"site data updated",
      data:siteData
    })
  }
  catch(error){
    return res.status(500).send({
      success:false,
      message:`Error:- ${error.message}`
    })
  }
}
module.exports=editSiteDetail
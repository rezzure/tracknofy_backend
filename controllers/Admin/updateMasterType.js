const MasterTypeConfig = require("../../Schema/addMasterType.schema/addMasterType.model");
const Admin = require("../../Schema/admin.schema/admine.model")
const updateMasterTypeDetail = async(req,res) =>{

  const {_id} = req.params;
  console.log(_id)
  const { master_type_id, master_type_name, master_type_description, email} = req.body;
  console.log(master_type_id, master_type_name, master_type_description, date ,email)
  

  try {
    const masterType = await MasterTypeConfig.findById(_id)
    console.log(masterType)
    const admin = await Admin.findOne({email:email})
    console.log(admin)
    if(!masterType){
      return res.status(404).send({
        success:true,
        message:"master type data not found"
      })
    }
    if(master_type_id) masterType.master_type_id = master_type_id;
    if(master_type_name) masterType.master_type_name = master_type_name;
    if(master_type_description) masterType.master_type_description = master_type_description;
    if(masterType.created_by.toString() !== admin._id.toString()) masterType.updated_by = admin._id
    masterType.createdAt=Date.now()
    await masterType.save();
    return res.status(200).send({
      success:true,
      message:"master type data updated successfully",
      data:masterType
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:`Internal Server Error:- ${error.message}`
    })
  }
}

module.exports = updateMasterTypeDetail;
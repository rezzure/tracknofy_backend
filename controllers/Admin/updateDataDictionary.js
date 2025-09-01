const MasterItem = require("../../Schema/AddDataDictionary.schema/MasterItem.model");
const Admin = require("../../Schema/admin.schema/admine.model")
const updateDataDictionaryDetail = async(req,res) =>{

  const {_id} = req.params;
  console.log(_id)
  const { master_type_id, master_type_name, master_type_description, email} = req.body;
  console.log(master_type_id, master_type_name, master_type_description, date ,email)
  

  try {
    const dataDictionary = await MasterTypeConfig.findById(_id)
    console.log(dataDictionary)
    const admin = await Admin.findOne({email:email})
    console.log(admin)
    if(!dataDictionary){
      return res.status(404).send({
        success:true,
        message:"Data dictionary data not found"
      })
    }
    if(master_type_id) dataDictionary.master_type_id = master_type_id;
    if(master_type_name) dataDictionary.master_type_name = master_type_name;
    if(master_type_description) dataDictionary.master_type_description = master_type_description;
    if(dataDictionary.created_by.toString() !== admin._id.toString()) dataDictionary.updated_by = admin._id
    dataDictionary.createdAt=Date.now()
    await dataDictionary.save();
    return res.status(200).send({
      success:true,
      message:"Data dictionary data updated successfully",
      data:dataDictionary
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:`Internal Server Error:- ${error.message}`
    })
  }
}

module.exports = updateDataDictionaryDetail;
const PartnerManagement = require("../../Schema/partnerManagement.schema/partnerManagement.model");
const Admin = require("../../Schema/admin.schema/admine.model")
const updatePartnerDetail = async(req,res) =>{

  const {_id} = req.params;
  const { partnerType, partnerName, partnerMobile, partnerAddress ,email} = req.body;
  const partnerPhotoFile = req.files?.['partnerPhoto']?.[0];
  const partnerIdProofFile = req.files?.['partnerIdProof']?.[0];

  try {
    const partner = await PartnerManagement.findById(_id)
    const admin = await Admin.findOne({email:email})
    if(!partner){
      return res.status(404).send({
        success:true,
        message:"partner data not found"
      })
    }
    if(partnerType) partner.partnerType = partnerType;
    if(partnerName) partner.partnerName = partnerName;
    if(partnerMobile) partner.partnerMobile = partnerMobile;
    if(partnerAddress) partner.partnerAddress = partnerAddress;
    if(partnerPhotoFile) partner.partnerPhoto = partnerPhotoFile.filename;
    if(partnerIdProofFile) partner.partnerIdProof = partnerIdProofFile.filename;
    if(partner.createdBy.toString() !== admin._id.toString()) partner.createdBy = admin._id
    partner.createdAt=Date.now()
    await partner.save();
    return res.status(200).send({
      success:true,
      message:"partner data updated successfully",
      data:partner
    })
  } catch (error) {
    return res.status(500).send({
      success:false,
      message:`Internal Server Error:- ${error.message}`
    })
  }
}

module.exports = updatePartnerDetail;
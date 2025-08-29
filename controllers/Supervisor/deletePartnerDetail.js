const PartnerManagement = require("../../Schema/partnerManagement.schema/partnerManagement.model")

const deletePartnerDetail = async (req, res) =>{
  const {_id} = req.params
  try {
    const deletedData = await PartnerManagement.findByIdAndDelete(_id)
    if(!deletedData){
      return res.status(404).send({
        success: false,
        message: "Partner Data Not Found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "Partner Data Deleted",
      data: deletedData
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error:- ${error.message}`
    })
  }
}
 
module.exports = deletePartnerDetail
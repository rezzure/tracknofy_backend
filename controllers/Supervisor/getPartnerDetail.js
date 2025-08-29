const PartnerManagement = require("../../Schema/partnerManagement.schema/partnerManagement.model")

const getPartnerDetail = async (req, res) => {
  try {
    const partnerDetail = await PartnerManagement.find()
    if(partnerDetail.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Partner Found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "Partner Details Found",
      data: partnerDetail
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error:- ${error.message}`
    })
  }
}

module.exports = getPartnerDetail
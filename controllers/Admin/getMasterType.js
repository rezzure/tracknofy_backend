const MasterTypeConfig = require("../../Schema/addMasterType.schema/addMasterType.model")

const getMasterTypeDetail = async (req, res) => {
  try {
    const masterTypeDetail = await MasterTypeConfig.find()
    if(masterTypeDetail.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No master type found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "Master type details found",
      data: masterTypeDetail
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error ${error.message}`
    })
  }
}

module.exports = getMasterTypeDetail
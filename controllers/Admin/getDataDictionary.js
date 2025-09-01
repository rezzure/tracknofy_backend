const MasterItem = require("../../Schema/AddDataDictionary.schema/MasterItem.model")

const getDataDictionaryDetail = async (req, res) => {
  try {
    const dataDictionaryDetail = await MasterItem.find()
    if(dataDictionaryDetail.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No data dictionary found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "Data dictionary details found",
      data: dataDictionaryDetail
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error ${error.message}`
    })
  }
}

module.exports = getDataDictionaryDetail
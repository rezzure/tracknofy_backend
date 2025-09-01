const MasterItem = require("../../Schema/AddDataDictionary.schema/MasterItem.model")

const deleteDataDictionaryDetail = async (req, res) =>{
  const {_id} = req.params
  try {
    const deletedData = await MasterItem.findByIdAndDelete(_id)
    if(!deletedData){
      return res.status(404).send({
        success: false,
        message: "Data dictionary data not found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "Data dictionary data deleted successfully",
      data: deletedData
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error ${error.message}`
    })
  }
}
 
module.exports = deleteDataDictionaryDetail
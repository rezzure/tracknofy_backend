const MaterialMaster = require("../../Schema/materialMaster.schema/materialMaster.model")

const getMaterialMaster = async (req, res) => {
   try {
     const materialData = await MaterialMaster.find()
    if(!materialData){
        return res.status(404).send({
            success: false,
            message: "Data not found",
        })
    }
    return res.status(200).send({
        success: true,
        message: "Data found ",
        data: materialData
    })
   } catch (error) {
    return res.status(500).send({
        success: false,
        message: `Internal server error ${error.message}`
    })
   }
}

module.exports = getMaterialMaster
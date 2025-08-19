const MaterialMaster = require("../../Schema/materialMaster.schema/materialMaster.model")

const deleteMaterialMaster = async (req, res) => {
    const { _id} = req.params

    try {
        const deletedData = await MaterialMaster.findByIdAndDelete(_id)
        if(!deletedData) {
            return res.status(404).send({
                success: false,
                message: "Material data not found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Data deleted successfully",
            data: deletedData
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = deleteMaterialMaster
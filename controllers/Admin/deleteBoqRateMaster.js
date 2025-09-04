const BoqRateMaster = require("../../Schema/boqRateMaster.schema/boqRateMaster.model")

const deleteBoqRateDetail = async (req, res) =>{
    const {_id} = req.params
    console.log(_id)
    try {
        const deletedData = await BoqRateMaster.findByIdAndDelete(_id)
        if(!deletedData) {
            return res.status(500).send({
                success: false,
                message: "Boq Rate Data Not Found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Boq Rate Data Deleted Successfully",
            data: deletedData
        })
    } catch (error) {
        console.log(error.message)
        return res.status(404).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = deleteBoqRateDetail
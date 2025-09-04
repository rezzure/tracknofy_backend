const BoqRateMaster = require("../../Schema/boqRateMaster.schema/boqRateMaster.model")

const getBoqRateDetail = async (req, res) =>{
    try {
        const boqRateData = await BoqRateMaster.find()
        if(boqRateData.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Boq Rate data not found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Boq Rate data found successfully",
            data: boqRateData
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = getBoqRateDetail
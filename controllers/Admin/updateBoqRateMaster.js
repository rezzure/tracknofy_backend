const Admin = require("../../Schema/admin.schema/admine.model")
const BoqRateMaster = require("../../Schema/boqRateMaster.schema/boqRateMaster.model")

const updateBoqRateDetail = async (req, res) => {
    const {_id} = req.params
    console.log(_id)
    const {workItem, base_rate, baseRateDescription, average_rate, averageRateDescription, premium_rate, premiumRateDescription, remarks, email} = req.body
    try {
        const boqRateDetail = await BoqRateMaster.findById(_id)
        const admin = await Admin.findOne({email:email})
        if(!boqRateDetail){
            return res.status(404).send({
                success: false,
                message: "Boq rate detail not found"
            })
        }
        if(workItem) boqRateDetail.workItem = workItem
        if(base_rate) boqRateDetail.baseRate = {
            rate:base_rate,
            rateDescription: baseRateDescription
        }
        if(average_rate) boqRateDetail.averageRate = {
            rate: average_rate,
            rateDescription: averageRateDescription
        }
        if(premium_rate) boqRateDetail.premiumRate = {
            rate: premium_rate,
            rateDescription: premiumRateDescription
        }
        if(remarks) boqRateDetail.remarks = remarks
        // if(boqRateDetail.createdBy.toString() !== admin._id.toString()) boqRateDetail.createdBy = admin._id
        console.log("5")
        boqRateDetail.updatedAt = Date.now()
        await boqRateDetail.save()
        res.status(200).send({
            success: true,
            message: "Boq rate detail updated successfully",
            data: boqRateDetail
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = updateBoqRateDetail
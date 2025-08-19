const VendorManagement = require("../../Schema/vendorManagement.schema/vendorManagement.model")

const getVendorDetail = async (req, res) =>{
    try {
        const vendorData = await VendorManagement.find()
        if(vendorData.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Vendor data not found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Vendor data found successfully",
            data: vendorData
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = getVendorDetail
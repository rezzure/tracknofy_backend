const VendorManagement = require("../../Schema/vendorManagement.schema/vendorManagement.model")

const deleteVendorDetail = async (req, res) =>{
    const {_id} = req.params

    try {
        const deletedData = await VendorManagement.findByIdAndDelete(_id)
        if(!deletedData) {
            return res.status(500).send({
                success: false,
                message: "Vendor data not found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Vendor data deleted successfully",
            data: deletedData
        })
    } catch (error) {
        return res.status(404).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = deleteVendorDetail
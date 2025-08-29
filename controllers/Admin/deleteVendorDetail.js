const VendorManagement = require("../../Schema/vendorManagement.schema/vendorManagement.model")

const deleteVendorDetail = async (req, res) =>{
    const {_id} = req.params
    console.log(_id)
    try {
        const deletedData = await VendorManagement.findByIdAndDelete(_id)
        if(!deletedData) {
            return res.status(500).send({
                success: false,
                message: "Vendor Data Not Found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Vendor Data Deleted Successfully",
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

module.exports = deleteVendorDetail
const VendorManagement = require("../../Schema/vendorManagement.schema/vendorManagement.model")
const Admin = require("../../Schema/admin.schema/admine.model")

const updateVendorDetail = async (req, res) => {
    const {_id} = req.params
    const {vendorName, vendorCompany, vendorAddress, vendorMobile, vendorEmail, remarks, email} = req.body

    try {
        const vendorDetail = await VendorManagement.findById(_id)
        const admin = await Admin.findOne({email:email})
        if(!vendorDetail){
            return res.status(404).send({
                success: false,
                message: "Vendor detail not found"
            })
        }
        if(vendorName) vendorDetail.vendorName = vendorName
        if(vendorCompany) vendorDetail.vendorCompany = vendorCompany
        if(vendorAddress) vendorDetail.vendorAddress = vendorAddress
        if(vendorMobile) vendorDetail.vendorMobile = vendorMobile
        if(vendorEmail) vendorDetail.vendorEmail = vendorEmail
        if(remarks) vendorDetail.remarks = remarks
        if(vendorDetail.createdBy.toString() !== admin._id.toString()) vendorDetail.createdBy = admin._id
        vendorDetail.createdAt = Date.now()
        await vendorDetail.save()
        res.status(200).send({
            success: true,
            message: "Vendor detail updated successfully",
            data: vendorDetail
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = updateVendorDetail
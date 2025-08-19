const VendorManagement = require('../../Schema/vendorManagement.schema/vendorManagement.model')
const Admin = require('../../Schema/admin.schema/admine.model')

const addVendorManagement = async (req, res) =>{
    const {vendorName, vendorCompany, vendorAddress, vendorMobile, vendorEmail, remarks, email, date} = req.body
    try {
        const admin = await Admin.findOne({email:email})
        if(!admin){
            return res.status(404).send({
                success: false,
                message: "Admin data not found"
            })
        }
        const vendorData = new VendorManagement({
            vendorName: vendorName,
            vendorCompany: vendorCompany,
            vendorAddress: vendorAddress,
            vendorMobile: vendorMobile,
            vendorEmail: vendorEmail,
            remarks: remarks || "No remarks",
            createdBy: admin._id,
            createdAt: date
        })
        await vendorData.save()
        return res.status(200).send({
            success: true,
            message: "Vendor created successfully",
            data: vendorData
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

module.exports = addVendorManagement
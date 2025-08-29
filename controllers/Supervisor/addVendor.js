const VendorManagement = require('../../Schema/vendorManagement.schema/vendorManagement.model')
const Supervisor = require('../../Schema/supervisor.schema/supervisor.model')

const addVendorManagement = async (req, res) =>{
    const email = req.query.email
    const {vendorName, vendorCompany, vendorAddress, vendorMobile, vendorEmail, remarks, date} = req.body
    try {
        const supervisor = await Supervisor.findOne({email:email})
        if(!supervisor){
            return res.status(404).send({
                success: false,
                message: "Supervisor Data Not Found"
            })
        }
        const vendorData = new VendorManagement({
            vendorName: vendorName,
            vendorCompany: vendorCompany,
            vendorAddress: vendorAddress,
            vendorMobile: vendorMobile,
            vendorEmail: vendorEmail,
            remarks: remarks || "No remarks",
            createdBy: supervisor._id,
            createdAt: date
        })
        await vendorData.save()
        return res.status(200).send({
            success: true,
            message: "Vendor Created ",
            data: vendorData
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error:- ${error.message}`
        })
    }
}

module.exports = addVendorManagement
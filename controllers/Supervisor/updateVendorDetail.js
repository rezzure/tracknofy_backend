// const VendorManagement = require("../../Schema/vendorManagement.schema/vendorManagement.model")
// const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")

// const updateVendorDetail = async (req, res) => {
//     const {_id} = req.params
//     const {vendorName, vendorCompany, vendorAddress, vendorMobile, vendorEmail, remarks, email} = req.body

//     try {
//         const vendorDetail = await VendorManagement.findById(_id)
//         console.log(vendorDetail)
//         const supervisor = await Supervisor.findOne({email:email})
//         console.log(supervisor)
//         if(!vendorDetail){
//             return res.status(404).send({
//                 success: false,
//                 message: "Vendor Detail Not Found"
//             })
//         }
//         if(vendorName) vendorDetail.vendorName = vendorName
//         if(vendorCompany) vendorDetail.vendorCompany = vendorCompany
//         if(vendorAddress) vendorDetail.vendorAddress = vendorAddress
//         if(vendorMobile) vendorDetail.vendorMobile = vendorMobile
//         if(vendorEmail) vendorDetail.vendorEmail = vendorEmail
//         if(remarks) vendorDetail.remarks = remarks
//         if(vendorDetail.createdBy.toString() !== supervisor._id.toString()) vendorDetail.createdBy = supervisor._id
//         vendorDetail.createdAt = Date.now()
//         await vendorDetail.save()
//         res.status(200).send({
//             success: true,
//             message: "Vendor Detail Updated",
//             data: vendorDetail
//         })
//     } catch (error) {
//         return res.status(500).send({
//             success: false,
//             message: `Internal server error:- ${error.message}`
//         })
//     }
// }

// module.exports = updateVendorDetail



// new code


// const VendorManagement = require("../../Schema/vendorManagement.schema/vendorManagement.model")
// const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")

// const updateVendorDetail = async (req, res) => {
//     const {_id} = req.params
//     const {
//         vendorName, 
//         vendorCompany, 
//         vendorAddress, 
//         vendorMobile, 
//         vendorEmail, 
//         vendorCategory,
//         gstNo,
//         accountNo,
//         ifscCode,
//         remarks, 
//         email
//     } = req.body

//     try {
//         const vendorDetail = await VendorManagement.findById(_id)
//         console.log(vendorDetail)
//         const supervisor = await Supervisor.findOne({email:email})
//         console.log(supervisor)
//         if(!vendorDetail){
//             return res.status(404).send({
//                 success: false,
//                 message: "Vendor Detail Not Found"
//             })
//         }
//         if(vendorName) vendorDetail.vendorName = vendorName
//         if(vendorCompany) vendorDetail.vendorCompany = vendorCompany
//         if(vendorAddress) vendorDetail.vendorAddress = vendorAddress
//         if(vendorMobile) vendorDetail.vendorMobile = vendorMobile
//         if(vendorEmail) vendorDetail.vendorEmail = vendorEmail
//         if(vendorCategory) vendorDetail.vendorCategory = vendorCategory
//         if(gstNo !== undefined) vendorDetail.gstNo = gstNo
//         if(accountNo !== undefined) vendorDetail.accountNo = accountNo
//         if(ifscCode !== undefined) vendorDetail.ifscCode = ifscCode
//         if(remarks) vendorDetail.remarks = remarks
//         if(vendorDetail.createdBy.toString() !== supervisor._id.toString()) vendorDetail.createdBy = supervisor._id
//         vendorDetail.createdAt = Date.now()
//         await vendorDetail.save()
//         res.status(200).send({
//             success: true,
//             message: "Vendor Detail Updated Successfully",
//             data: vendorDetail
//         })
//     } catch (error) {
//         return res.status(500).send({
//             success: false,
//             message: `Internal server error:- ${error.message}`
//         })
//     }
// }

// module.exports = updateVendorDetail



// new code
const VendorManagement = require("../../Schema/vendorManagement.schema/vendorManagement.model")
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model")

const updateVendorDetail = async (req, res) => {
    const {_id} = req.params
    const {
        vendorName, 
        vendorCompany, 
        vendorAddress, 
        vendorMobile, 
        vendorEmail, 
        vendorCategory,
        gstNo,
        accountNo,
        ifscCode,
        remarks, 
        email
    } = req.body

    try {
        const vendorDetail = await VendorManagement.findById(_id)
        console.log(vendorDetail)
        const supervisor = await Supervisor.findOne({email:email})
        console.log(supervisor)
        if(!vendorDetail){
            return res.status(404).send({
                success: false,
                message: "Vendor Detail Not Found"
            })
        }
        if(vendorName) vendorDetail.vendorName = vendorName
        if(vendorCompany) vendorDetail.vendorCompany = vendorCompany
        if(vendorAddress) vendorDetail.vendorAddress = vendorAddress
        if(vendorMobile) vendorDetail.vendorMobile = vendorMobile
        if(vendorEmail) vendorDetail.vendorEmail = vendorEmail
        if(vendorCategory) vendorDetail.vendorCategory = vendorCategory
        if(gstNo !== undefined) vendorDetail.gstNo = gstNo
        if(accountNo !== undefined) vendorDetail.accountNo = accountNo
        if(ifscCode !== undefined) vendorDetail.ifscCode = ifscCode
        if(remarks) vendorDetail.remarks = remarks
        if(vendorDetail.createdBy.toString() !== supervisor._id.toString()) {
            vendorDetail.createdBy = supervisor._id
            vendorDetail.createdByModel = "Supervisor"
        }
        vendorDetail.createdAt = Date.now()
        await vendorDetail.save()
        res.status(200).send({
            success: true,
            message: "Vendor Detail Updated Successfully",
            data: vendorDetail
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error:- ${error.message}`
        })
    }
}

module.exports = updateVendorDetail
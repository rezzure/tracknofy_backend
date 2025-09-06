const Quotation = require("../../Schema/interior.schema/quotation.model")

const getQuotationSubItems = async (req,res)=>{
    try {
        const data = await Quotation.find()
        console.log(data)
        if(data.length === 0){
            return res.status(400).send({
                success:false,
                message:"Data Not Found"
            })
        }
        return res.status(200).send({
            success:true,
            message:"data found",
            data:data
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:`Internal Server Error:- ${error.message}`
        })
    }
}
module.exports = getQuotationSubItems
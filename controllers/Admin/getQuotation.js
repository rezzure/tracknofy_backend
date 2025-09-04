const Quotation = require("../../Schema/interior.schema/quotation.model");

const getQuotation = async(req,res)=>{
    try {
        const quotations = await Quotation.find();
        console.log(quotations)
        if(quotations.length === 0){
          return  res.status(400).send({
                success:false,
                message:"Data Not Found"
            })
        }
        res.status(200).send({
            success:true,
            message:"Data Found",
            data:quotations
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:`Internal Server Error ${error.message}`
        })
    }
}
module.exports = getQuotation
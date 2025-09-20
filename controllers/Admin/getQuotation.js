const Quotation = require("../../Schema/interior.schema/quotation.model");

const getQuotation = async(req,res)=>{
    const{_id} = req.params
    
    try {

        if(_id.toString()==="1"){
            console.log(_id)
            
            const quotations = await Quotation.find();
            console.log(quotations)
            if(quotations.length === 0){
              return  res.status(400).send({
                    success:false,
                    message:"Data Not Found"
                })
            }
           return res.status(200).send({
                success:true,
                message:"Data Found",
                data:quotations
            })
        }
        else{
            const quotationData = await Quotation.find();
           const data= quotationData.filter(data=> data.projectTypeId.toString() === _id.toString())
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
        }
    } catch (error) {
        res.status(500).send({
            success:false,
            message:`Internal Server Error ${error.message}`
        })
    }
}
module.exports = getQuotation
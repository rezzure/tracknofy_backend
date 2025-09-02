const Features = require("../../Schema/addFeature.schema/addFeature.model")
const getFeature = async(req,res)=>{
    try {
        const features = await Features.find()
        if(features.length === 0){
           return res.status(400).send({
                success:false,
                message:"Data Not Found"
            })
        }
        console.log(features)
        return res.status(200).send({
            success:true,
            message:"Features Found",
            data:features
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:`Internal Server Error:- ${error.message}`
        })
    }
}
module.exports = getFeature
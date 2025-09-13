const Site = require("../../Schema/site.Schema/site.model")

const getSiteById = async(req,res)=>{
    const {_id} = req.params
    try {
        const site = await Site.findById(_id)
        if(!site){
            return res.status(400).send({
                success:false,
                message:"data not found"
            })
        }
        return res.status(200).send({
            success:true,
            message:"data found",
            data:site
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:`Internal Server Error:- ${error.message}`
        })
    }
}
module.exports = getSiteById
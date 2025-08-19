const Site = require("../../Schema/site.Schema/site.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

const allotedSite = async(req,res)=>{
     const email = req.query.email;
    try{
        const user = await Supervisor.findOne({email:email});
        const siteData = await Site.find({supervisorId:user._id})       
        if(siteData.length <= 0){
            return res.send({
                success:false,
                message:"no site found"
            })
        }
        console.log(siteData)
        return res.status(200).send({
            success:true,
            message:"data found....",
            data:siteData
        })
    }
    catch(err){
        return res.status(501).send({
            success:false,
            message:"error:- "+err
        })
    }
}

module.exports=allotedSite
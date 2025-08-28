const Client = require("../../Schema/client.schema/client.model");
const Progress =require("../../Schema/progressReport.schema/progressReport.model");

const getProgressReport =async (req,res)=>{
    const email = req.query.email;
    try{
        const client = await Client.findOne({email:email})
        console.log(client)
        const progressReport = await Progress.find({siteName:client.sitename,supervisor:client.supervisor_name})
        console.log(progressReport)
        if(!progressReport){
            return res.send({
                success:false,
                message:"No Report Found"
            })
        }
        return res.status(200).send({
            success:true,
            message:"Progress Report Found",
            data:progressReport
        })
    }
    catch(err){
        res.status(501).send({
            success:false,
            message:`Internal Server Error:- ${err.message}`
        })
    }
}
module.exports = getProgressReport
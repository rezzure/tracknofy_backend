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
                message:"no progress report found"
            })
        }
        return res.status(200).send({
            success:true,
            message:"progress report found",
            data:progressReport
        })
    }
    catch(err){
        res.status(501).send({
            success:false,
            message:`error found:-${err.message}`
        })
    }
}
module.exports = getProgressReport
const Progress = require("../../../Schema/progressReport.schema/progressReport.model");


const getProgressReport =async (req,res)=>{
    const email = req.query.email;
    console.log(email)
    try{
       
        const progressReport = await Progress.find().sort({ createdAt: -1 })
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
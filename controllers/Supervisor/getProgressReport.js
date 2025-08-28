const Progress = require("../../Schema/progressReport.schema/progressReport.model")

const getProgressReport = async(req,res)=>{
    const {_id} = req.params
    console.log(_id)
    try {
        const progressReports = await Progress.find({supervisorId:_id})
        if(!progressReports){
            return res.status(404).send({
                success:true,
                message:"Data Not Found..."
            })
        }
       return res.status(200).send({
            success:true,
            message:"Progress Data Fetched.",
            data:progressReports,
        })
    } catch (error) {
       res.status(500).send({
        success:false,
        message:`Internal Server Error:- ${error.message}`
       }) 
    }
}

module.exports=getProgressReport




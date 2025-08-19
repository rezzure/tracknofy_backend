const Progress = require("../../Schema/progressReport.schema/progressReport.model")

const getProgressReport = async(req,res)=>{
    const {_id} = req.params
    console.log(_id)
    try {
        const progressReports = await Progress.find({supervisorId:_id})
        // console.log(progressReports)
        if(!progressReports){
            return res.status(404).send({
                success:true,
                message:"data not found..."
            })
        }
        // const formattedReports = progressReports.map(report => ({
        //     ...report,
        //     photos: report.photos.map(photo => ({
        //         ...photo,
        //         url: `/uploads/${photo.filename}` // Construct proper URL
        //     })),
        //     reportDate: report.reportDate.toISOString() // Format date
        // }));
       return res.status(200).send({
            success:true,
            message:"progress data fetched.",
            data:progressReports,
        })
    } catch (error) {
       res.status(500).send({
        success:false,
        message:`Error:- ${error.message}`
       }) 
    }
}

module.exports=getProgressReport




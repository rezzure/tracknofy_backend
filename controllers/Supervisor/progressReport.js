const Progress = require("../../Schema/progressReport.schema/progressReport.model");
const Site = require("../../Schema/site.Schema/site.model");
const User = require("../../Schema/users.schema/users.model");

const progressReport = async(req,res)=>{
    const {id} = req.params
    console.log(id)
    const { projectId, description, date } = req.body;
    const photos = req.files
    console.log( projectId,description, date)
    console.log(photos)
    try{
        const siteData = await Site.findById({_id:projectId});
        const supervisorData = await User.findById({_id:id})
        if(!siteData ){
            return res.send({
                success:false,
                message:"data missmatched either supervisor or site not found"
            })
        }
        const reportData = new Progress({
            siteName:siteData.siteName,
            site:projectId,
            supervisor:supervisorData.name,
            supervisorId:id,
            reportDate:date, 
            description:description,
            photos: photos.map(file => ({
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                destination: file.destination,
                filename: file.filename,
                path: file.path,
                size: file.size
            })),
        });
        const updatedData = await reportData.save();
        return res.status(200).send({
            success:true,
            message:"Data submitted success",
            data:updatedData
        })


    }
    catch(err){
        return res.status(501).send({
            success:false,
            message:`error !!!!! :-${err}`
        })
    }
    
}

module.exports=progressReport


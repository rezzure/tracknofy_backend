const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

const supervisorDetail = async (req,res)=>{
    const email = req.query.email;
    console.log(email)
    try {
        const supervisorData = await Supervisor.findOne({email:email})
        if(!supervisorData){
            return res.status(404).send({
                success:false,
                message:"Supervisor data not found..."
            })
        }
        console.log(supervisorData)
        return res.status(200).send({
            success:true,
            message:"User data found...",
            data:supervisorData
        })
    } catch (error) {
        console.log(error.message)
       return res.status(500).send({
        success:false,
        message:`Error:- ${error.message}`
       }) 
    }
}

module.exports=supervisorDetail

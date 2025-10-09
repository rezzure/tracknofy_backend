const Supervisor = require("../../../Schema/supervisor.schema/supervisor.model")

 const getAssignUserSite = async (req, res)=> {
     const email = req.query.email
    
     try {
        const assignUserSite = await Supervisor.find({email : email})
        if(!assignUserSite){
           return res.status(400).send({
              success : false,
              message : "Assign Site Details not found"
           })
        }

        return res.status(200).json({
            success : true,
            data : assignUserSite,
            message : "Assign Site Details Fetched Successfully"
        })
     } catch (error) {
         res.status(500).json({
            success: false,
            message: "Internal server error"
        });
     }
 }

module.exports=getAssignUserSite;
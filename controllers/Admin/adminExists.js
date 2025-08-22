const Admin = require("../../Schema/admin.schema/admine.model")


const checkAdminExist = async(req, res)=> {
   try {
    const admin = await Admin.find()
    console.log(admin)
    if (admin) {
        return res.status(200).send({
            success : true,
            message : "admin exist please login",
            adminExists : true,
            data : admin
        })
    }

   } catch (error) {
       return res.status(400).send({
            success : false,
            message : error.message 
        })
   }
}

module.exports=checkAdminExist;
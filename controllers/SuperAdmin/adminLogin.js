const jwt = require('jsonwebtoken');

const superAdminLogin = async (req, res) =>{
   try {
      const { email , password} = req.body;

      if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        //create token
        const token = jwt.sign(email+password, process.env.JWT_SECRET)
        res.json({
           success : true,
           token,
           message : "admin login successfully"
        })
      }else {
        res.json({
            success : false,
            message : "Invalid credentials"
        })
      }
   } catch (error) {
       res.json({
            success : false,
            message :  error.message
        })
   }
}

module.exports=superAdminLogin;
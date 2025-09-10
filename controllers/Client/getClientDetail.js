const Client = require("../../Schema/client.schema/client.model")

const getClientDetails = async (req, res) => {
    const email = req.query.email
    console.log(email)
    try {

        const user = await Client.findOne({email:email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Client Data Not Found'
            })
        }
          console.log(user)
       return res.status(200).send({
            success:true,
            data:user,
            message:'Client Detail Found'
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:`Internal Server Error:- ${error.message}`
        })
    }
}

module.exports = getClientDetails
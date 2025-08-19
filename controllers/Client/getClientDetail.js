const Client = require("../../Schema/client.schema/client.model")

const getClientDetails = async (req, res) => {
    const email = req.query.email
    console.log(email)
    try {

        const user = await Client.findOne({email:email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'client data not found'
            })
        }
console.log(user)
       return res.status(200).send({
            success:true,
            data:user,
            message:'client detail found'
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:error
        })
    }
}

module.exports = getClientDetails
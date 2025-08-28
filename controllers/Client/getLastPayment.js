const Client = require("../../Schema/client.schema/client.model")
const Payments = require("../../Schema/recivedPayments.Schema/payment.model")

const getLastPayment = async (req, res) => {
    const email = req.query.email
    // console.log(email)

    try {
        const client = await Client.findOne({email:email})
        const lastPayment = await Payments.findOne({clientId:client._id})
       if(!lastPayment) {
         return res.status(400).send({
            success: false,
            message: 'Payment Data Not Found'
        })
       }
       return res.status(200).send({
        success: true,
        message: 'Last Payment Found Successfully',
        data: lastPayment
       })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error:- ${error.message}`
        })
    }
}


module.exports = getLastPayment

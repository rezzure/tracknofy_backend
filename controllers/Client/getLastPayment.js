const Client = require("../../Schema/client.schema/client.model")
const Payments = require("../../Schema/recivedPayments.Schema/payment.model")

const getLastPayment = async (req, res) => {
    const email = req.query.email
    // console.log(email)

    try {
        const client = await Client.findOne({email:email})
        const lastPayment = await Payments.findOne({clientId:client._id})
       if(!lastPayment) {
         res.status(400).send({
            success: false,
            message: 'Payment data not found'
        })
       }
       return res.status(200).send({
        success: true,
        message: 'Last payment found successfully',
        data: lastPayment
       })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}


module.exports = getLastPayment
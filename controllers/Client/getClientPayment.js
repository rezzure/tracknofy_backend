const Client = require("../../Schema/client.schema/client.model");
const Payments = require("../../Schema/recivedPayments.Schema/payment.model");

const getClientPayments = async (req, res) => {
  const email = req.query.email
  console.log(email);
  
  try {
    const client = await Client.findOne({email:email});
    const payments = await Payments.find({clientId:client._id}).sort({ createdAt: -1 })
    if(payments.length === 0){
      return res.status(400).send({
        success:true,
        message:"No Data Found"
      })
    }
      console.log(payments)
    const mappedPayments = payments.map(payment => ({
      id: payment._id,
      amount: payment.amount,
      method: payment.mode,
      transactionId: payment.transactionId,
      date: payment.transactionDate,
      status: payment.status,
      proofDocument: payment.proofDocument,
      invoice: payment.invoiceDocument || null
    }));
    console.log(mappedPayments)
    res.status(200).json({
      success:true,
      message:"Payment Data Found",
      data:mappedPayments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ 
      success:false,
      message: 'Failed to fetch payments', 
      error: error.message
    });
  }
};
module.exports =getClientPayments
const Payments = require("../../Schema/recivedPayments.Schema/payment.model");

const getPaymentDetail = async (req, res) => {
  try {
    const details = await Payments.find();
    if (!details) {
      return res.send({
        success: false,
        message: "No Payment Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Payment Data Found",
      data: details,
    });
  } catch (err) {
    return res.status(501).send({
      success: false,
      message: "Internal Server Error " + err.message,
    });
  }
}

module.exports=getPaymentDetail

const Payments = require("../../Schema/recivedPayments.Schema/payment.model");

const getPaymentDetail = async (req, res) => {
  try {
    const details = await Payments.find();
    if (!details) {
      return res.send({
        success: false,
        message: "no payment found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "data found....",
      data: details,
    });
  } catch (err) {
    return res.status(501).send({
      success: false,
      message: "internal server error " + err.message,
    });
  }
}

module.exports=getPaymentDetail

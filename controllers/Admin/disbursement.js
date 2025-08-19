const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");

const disbursement = async (req, res) => {
  const { email, amount } = req.body;
  try {
    let user = await Supervisor.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.total_payment = user.total_payment + amount;
    user.balance_amount = user.total_payment - user.total_expense;
    await user.save();

    console.log(user);
    res.status(200).send({
      success: true,
      message: "Disbursement successful",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports=disbursement
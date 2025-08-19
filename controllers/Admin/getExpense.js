const Expense = require("../../Schema/expenses.schema/expense.model");

const getExpense = async (req, res) => {
  try {
    const expenseDetails = await Expense.find();
    if (!expenseDetails) {
      return req.send({
        success: false,
        message: "on expense detai found",
      });
    }
    // const pendingexpense = expenseDetails.filter(
    //   (expense) => expense.status === "pending"
    // );
    return res.status(200).send({
      success: true,
      message: "data fetched....",
      // length: pendingexpense.length,
      data: expenseDetails,
    });
  } catch (err) {
    return res.status(501).send({
      success: false,
      message: "internal server error " + err.message,
    });
  }
}

module.exports=getExpense
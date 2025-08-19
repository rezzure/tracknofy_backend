const Client = require("../../Schema/client.schema/client.model");
const Expense = require("../../Schema/expenses.schema/expense.model");
const Supervisor = require("../../Schema/supervisor.schema/supervisor.model");
const Admin = require("../../Schema/admin.schema/admine.model")

const updateExpenseStatus = async (req, res) => {
  const email = req.query.email
  console.log(req.body)
  const { supervisorEmail, status, expenseId } = req.body;
  try {
    const supervisor = await Supervisor.findOne({ email: supervisorEmail });
    const admin = await Admin.findOne({email:email})
    if (!supervisor) {
      return res.send({
        success: false,
        message: "supervisor not found!!!",
      });
    }
    const expense = await Expense.findById({ _id: expenseId });
    if (!expense) {
      return res.send({
        success: false,
        message: "expense data not found!!!",
      });
    }
    expense.status = status;
    await expense.save();

    if (status === "approved") {
      supervisor.total_expense = expense.amount;
      supervisor.balance_amount =
        supervisor.total_payment - supervisor.total_expense;
      await supervisor.save();

      const clientData = await Client.findOne({
        _id: supervisor.allorted_client,
      });

      clientData.total_expense = expense.amount;
      clientData.balance_amount =
        clientData.total_payment - clientData.total_expense;
      await clientData.save();

      // need to remove expense request from expense collection if needed

      return res.status(200).send({
        success: true,
        message: "approval success....",
      });
    }
    if (status === "rejected") {
      return res.status(200).send({
        success: true,
        message: " expense rejected !!!",
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "internal server error" + err.message,
    });
  }
}

module.exports=updateExpenseStatus
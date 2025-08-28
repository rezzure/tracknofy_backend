const Expense = require("../../Schema/expenses.schema/expense.model");

const getExpenseDetail = async(req,res)=>{
    const {_id} = req.params;
    console.log(_id)
    try {
        const expenseData = await Expense.find({supervisor_id:_id})
        console.log(expenseData)
        if(!expenseData){
            return res.status(404).send({
                success:false,
                message:"Data Not Found..."
            })
        }
        res.status(200).send({
            success:true,
            message:"Expense Data Found",
            data:expenseData
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:`Internal Server Error:- ${error.message}`
        })
    }
}

module.exports=getExpenseDetail
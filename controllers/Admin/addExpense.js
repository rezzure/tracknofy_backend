const Expense = require("../../Schema/expenses.schema/expense.model");

const expenseDetail = async(req,res)=>{
    
  console.log(req.body);
  console.log(req.file);
  
  const{admin_id,adminName,adminEmail,expenseType,amount,description,date,site} = req.body
  
  // Check if file was uploaded
  let imageData = null;
  if (req.file) {
    imageData = {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      destination: req.file.destination,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    };
  }
  
  let expenseData = {
    expenseType: expenseType,
    siteName: site,
    amount: amount,
    description: description,
    date: date,
    supervisorEmail: supervisorEmail,
    status: "pending",
    image: imageData,
    supervisorName: supervisorName,
    supervisor_id: supervisor_id,
    createdBy:supervisorName
  }
  
  try {
    let data = await Expense.create(expenseData)
    return res.status(200).send({
      success: true,
      message: "data submitted successfully",
      data: data
    })
  }
  catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error: " + err.message
    })
  }
}

module.exports = expenseDetail
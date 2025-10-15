const Admin = require("../../Schema/admin.schema/admine.model")
const BillingInvoice = require("../../Schema/BillingInvoice.schema/BillingInvoice.model")


const getInvoice = async (req, res )=>{
    try {
        const invoiceData = await BillingInvoice.
        find()
        if(BillingInvoice.length === 0) {
            return res.status(404).send({
                success: false,
                message:"Invoice data found "
            })
        }
        return res.status(200).send({
            seccess: true,
            message: "Invoice data found seccessfully",
            data:invoiceData
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error $
            {error.message}`
        })
    }
}

const addInvoice = async (req, res) => {
try {
    const { invoiceNumber, date, dueDate, companyData, clientData, itemDescription, totalAmount, notes, createdBy,  updatedBy } = req.body;

    console.log ( invoiceNumber, date, dueDate, companyData, clientData, itemDescription, totalAmount, notes, createdBy,  updatedBy )

    const admin = await Admin.findOne({email:email})

const newInvoice = new BillingInvoice({
    invoiceNumber, 
    date,
    dueDate,
    companyData,
    clientData, 
    itemDescription,
    totalAmount,
    notes,
    createdBy:admin._id,
    updatedBy,
});
await newInvoice.save()

res.status.send({
    success: true,
    message: 'Billing Invoice Data saved',
    data: newInvoice

})

} catch (error) {
    res.status(500).send({
        success: false,
        message: 'Internal Server Error',
        error: error.message
    });
}
}


const updateBillingInvoice = async (req, res) => {
   const {_id} = req.params
   const {
    invoiceNumber, 
    date,
    dueDate,
    companyData,
    clientData, 
    itemDescription,
    totalAmount,
    notes,
    createdBy,
    updatedBy,
   } = req.body
   const email = req.query.email
    try {
     const updatedInvoice = await BillingInvoice.
     findById(_id)
     const admin = await Admin.findOne
     ({email:email})

     if(!updatedInvoice){
        return res.status(404).send({
            success: false,
            message: "Invoice Detail not found"
        })
     }
    if( invoiceNumber) updatedInvoice.invoiceNumber = 
    invoiceNumber
    if(date ) updatedInvoice.date= date
    if(dueDate) updatedInvoice.dueDate= dueDate
    if(companyData ) updatedInvoice.companyData= companyData
    if(clientData)updatedInvoice.clientData= clientData
    if(itemDescription ) updatedInvoice.itemDescription= itemDescription
    if(totalAmount) updatedInvoice.totalAmount= totalAmount
    if(notes) updatedInvoice.notes= notes
    if(createdBy) updatedInvoice.createdBy= createdBy
    if(updatedBy) updatedInvoice.updatedBy= updatedBy
    if(updatedInvoice.createdBy.toString() !== admin._id.toString())
    {
        updatedInvoice.createdBy= admin._id
    }
    await updatedInvoice.save()
    res.status(200).send({
    success: true,
    message: " Billing Invoice updated successfully",
    data: updatedInvoice
    })

} catch (error) {
    return res.status(500).send({
        success: false,
        message:`Internal server error ${error.message}`
    })
}
}

const deleteInvoice = async (req, res) => {
    const { _id}= req.params;

    try {
        const Invoice = await Invoice.findById(_id)
        if (!Invoice) {
            return res.status(404).send({
                seccess: false,
                message: "Invoice is not found"
            });
        }

        await Invoice.findByIdAndDelete(_id);

        return res.status(200).send({
            success: true,
            message: "Invoice delated successfully"

        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error: "+ error.message,
        });
    }
};

module.exports = {
  getInvoice,
  addInvoice,
  updateBillingInvoice,
  deleteInvoice
};
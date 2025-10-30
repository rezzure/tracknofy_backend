// const Admin = require("../../Schema/admin.schema/admine.model")
// const BillingInvoice = require("../../Schema/BillingInvoice.schema/BillingInvoice.model")


// const getInvoice = async (req, res )=>{
//   console.log("line 6")
//     try {
//         const invoiceData = await BillingInvoice.find()
//         console.log("line 9")
//         if(BillingInvoice.length === 0) {
//             return res.status(404).send({
//                 success: false,
//                 message:"Invoice data found "
//             })
//         }
//         console.log("line 15")
//         return res.status(200).send({
//             seccess: true,
//             message: "Invoice data found seccessfully",
//             data:invoiceData
//         })
        
//     } catch (error) {
//         return res.status(500).send({
//             success: false,
//             message: `Internal server error $
//             {error.message}`
//         })
//     }
// }



// // FIX: Add missing email variable in addInvoice
// const addInvoice = async (req, res) => {
//   try {
//     const { invoiceNumber, date, dueDate, companyData, clientData, itemDescription, totalAmount, notes } = req.body;
    
//     // Get email from request (from verification middleware)
//     const email = req.query.email; // Assuming your verification middleware adds user to req
    
//     const admin = await Admin.findOne({ email: email });

//     const newInvoice = new BillingInvoice({
//       invoiceNumber, 
//       date,
//       dueDate,
//       companyData,
//       clientData, 
//       itemDescription,
//       totalAmount,
//       notes,
//       createdBy: admin._id,
//     });
    
//     await newInvoice.save();

//     res.status(201).send({ // FIX: Added status code 201
//       success: true,
//       message: 'Billing Invoice Data saved',
//       data: newInvoice
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message
//     });
//   }
// };





// const updateBillingInvoice = async (req, res) => {
//    const {_id} = req.params
//    const {
//     invoiceNumber, 
//     date,
//     dueDate,
//     companyData,
//     clientData, 
//     itemDescription,
//     totalAmount,
//     notes,
//     createdBy,
//     updatedBy,
//    } = req.body
//    const email = req.query.email
//     try {
//      const updatedInvoice = await BillingInvoice.
//      findById(_id)
//      const admin = await Admin.findOne
//      ({email:email})

//      if(!updatedInvoice){
//         return res.status(404).send({
//             success: false,
//             message: "Invoice Detail not found"
//         })
//      }
//     if( invoiceNumber) updatedInvoice.invoiceNumber = 
//     invoiceNumber
//     if(date ) updatedInvoice.date= date
//     if(dueDate) updatedInvoice.dueDate= dueDate
//     if(companyData ) updatedInvoice.companyData= companyData
//     if(clientData)updatedInvoice.clientData= clientData
//     if(itemDescription ) updatedInvoice.itemDescription= itemDescription
//     if(totalAmount) updatedInvoice.totalAmount= totalAmount
//     if(notes) updatedInvoice.notes= notes
//     if(createdBy) updatedInvoice.createdBy= createdBy
//     if(updatedBy) updatedInvoice.updatedBy= updatedBy
//     if(updatedInvoice.createdBy.toString() !== admin._id.toString())
//     {
//         updatedInvoice.createdBy= admin._id
//     }
//     await updatedInvoice.save()
//     res.status(200).send({
//     success: true,
//     message: " Billing Invoice updated successfully",
//     data: updatedInvoice
//     })

// } catch (error) {
//     return res.status(500).send({
//         success: false,
//         message:`Internal server error ${error.message}`
//     })
// }
// }





// // FIX: Change variable name from Invoice to BillingInvoice
// const deleteInvoice = async (req, res) => {
//   const { _id } = req.params;

//   try {
//     const invoice = await BillingInvoice.findById(_id); // FIX: Changed variable name
//     if (!invoice) {
//       return res.status(404).send({
//         success: false, // FIX: Changed "seccess" to "success"
//         message: "Invoice is not found"
//       });
//     }

//     await BillingInvoice.findByIdAndDelete(_id); // FIX: Changed variable name

//     return res.status(200).send({
//       success: true,
//       message: "Invoice deleted successfully" // FIX: Typo "delated" to "deleted"
//     });
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: "Error: " + error.message,
//     });
//   }
// };




// module.exports = {
//   getInvoice,
//   addInvoice,
//   updateBillingInvoice,
//   deleteInvoice
// };
















const Admin = require("../../Schema/admin.schema/admine.model")
const BillingInvoice = require("../../Schema/BillingInvoice.schema/BillingInvoice.model")

const getInvoice = async (req, res) => {
    try {
        const invoiceData = await BillingInvoice.find().populate('createdBy', 'name email')
        
        // FIX: Check invoiceData.length instead of BillingInvoice.length
        if (invoiceData.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No invoice data found"
            })
        }
        
        return res.status(200).send({
            success: true,
            message: "Invoice data found successfully",
            data: invoiceData
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        })
    }
}

const addInvoice = async (req, res) => {
    try {
        const { 
            invoiceNumber, 
            date, 
            dueDate, 
            companyData, 
            clientData, 
            shipToData,
            itemDescription, 
            additionalCharges,
            includeGST,
            previousDue,
            advancePayment,
            totalAmount, 
            notes,
            termsConditions 
        } = req.body;
        
        // Get email from request
        const email = req.query.email;
        
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).send({
                success: false,
                message: "Admin not found"
            });
        }

        // Ensure additionalCharges is properly formatted
        const formattedAdditionalCharges = Array.isArray(additionalCharges) 
            ? additionalCharges.map(charge => ({
                label: charge.label || '',
                amount: parseFloat(charge.amount) || 0
            }))
            : [];

        const newInvoice = new BillingInvoice({
            invoiceNumber, 
            date,
            dueDate,
            companyData,
            clientData,
            shipToData,
            itemDescription,
            additionalCharges: formattedAdditionalCharges,
            includeGST: includeGST || false,
            previousDue: previousDue || false,
            advancePayment: advancePayment || false,
            totalAmount,
            notes,
            termsConditions,
            createdBy: admin._id,
        });
        
        await newInvoice.save();

        // Populate the created invoice before sending response
        const populatedInvoice = await BillingInvoice.findById(newInvoice._id)
            .populate('createdBy', 'name email');

        res.status(201).send({
            success: true,
            message: 'Billing Invoice Data saved successfully',
            data: populatedInvoice
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const updateBillingInvoice = async (req, res) => {
    const { _id } = req.params;
    const {
        invoiceNumber, 
        date,
        dueDate,
        companyData,
        clientData,
        shipToData,
        itemDescription,
        additionalCharges,
        includeGST,
        previousDue,
        advancePayment,
        totalAmount,
        notes,
        termsConditions
    } = req.body;
    
    const email = req.query.email;
    
    try {
        const updatedInvoice = await BillingInvoice.findById(_id);
        const admin = await Admin.findOne({ email: email });

        if (!updatedInvoice) {
            return res.status(404).send({
                success: false,
                message: "Invoice Detail not found"
            });
        }

        if (!admin) {
            return res.status(404).send({
                success: false,
                message: "Admin not found"
            });
        }

        // Format additional charges
        const formattedAdditionalCharges = Array.isArray(additionalCharges) 
            ? additionalCharges.map(charge => ({
                label: charge.label || '',
                amount: parseFloat(charge.amount) || 0
            }))
            : [];

        // Update fields
        if (invoiceNumber) updatedInvoice.invoiceNumber = invoiceNumber;
        if (date) updatedInvoice.date = date;
        if (dueDate) updatedInvoice.dueDate = dueDate;
        if (companyData) updatedInvoice.companyData = companyData;
        if (clientData) updatedInvoice.clientData = clientData;
        if (shipToData) updatedInvoice.shipToData = shipToData;
        if (itemDescription) updatedInvoice.itemDescription = itemDescription;
        if (additionalCharges) updatedInvoice.additionalCharges = formattedAdditionalCharges;
        if (typeof includeGST !== 'undefined') updatedInvoice.includeGST = includeGST;
        if (typeof previousDue !== 'undefined') updatedInvoice.previousDue = previousDue;
        if (typeof advancePayment !== 'undefined') updatedInvoice.advancePayment = advancePayment;
        if (totalAmount) updatedInvoice.totalAmount = totalAmount;
        if (notes !== undefined) updatedInvoice.notes = notes;
        if (termsConditions !== undefined) updatedInvoice.termsConditions = termsConditions;
        
        // Update createdBy if different
        if (updatedInvoice.createdBy.toString() !== admin._id.toString()) {
            updatedInvoice.createdBy = admin._id;
        }
        
        // Set updatedBy
        updatedInvoice.updatedBy = admin._id;

        await updatedInvoice.save();

        // Populate before sending response
        const populatedInvoice = await BillingInvoice.findById(_id)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        res.status(200).send({
            success: true,
            message: "Billing Invoice updated successfully",
            data: populatedInvoice
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: `Internal server error ${error.message}`
        });
    }
}

const deleteInvoice = async (req, res) => {
    const { _id } = req.params;

    try {
        const invoice = await BillingInvoice.findById(_id);
        if (!invoice) {
            return res.status(404).send({
                success: false,
                message: "Invoice not found"
            });
        }

        await BillingInvoice.findByIdAndDelete(_id);

        return res.status(200).send({
            success: true,
            message: "Invoice deleted successfully"
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error: " + error.message,
        });
    }
};

module.exports = {
    getInvoice,
    addInvoice,
    updateBillingInvoice,
    deleteInvoice
};
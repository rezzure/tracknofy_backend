// const path = require("path");
// const Client = require("../../Schema/client.schema/client.model");
// const Payments = require("../../Schema/recivedPayments.Schema/payment.model")
// const fs = require('fs')
// const createClientPayment = async (req, res) => {
//   const email = req.query.email

//   const { amount, paymentMethod, transactionId, date } = req.body;
//     console.log(req.body)
//   const proofDocument = req.file;
//   console.log(proofDocument);
  
 
//   // // Validate required fields
//   if (!amount || !transactionId || !proofDocument) {
//     return res.status(400).json({
//       message: 'Amount, transaction ID, and payment proof are required.'
//     });
//   }
  
  
//   try {
//     // Prepare payment data
//     let user = await Client.findOne({email:email})
//     const paymentData = {
//       amount: amount,
//       mode: paymentMethod || 'UPI',
//       transactionId: transactionId.trim(),
//       transactionDate: date || new Date().toISOString(),
//       proofDocument: proofDocument,
//       status: 'pending',
//       clientId:user._id,
//       clientName:user.name,
//       siteName:user.sitename,

//       client: req.user._id, // Uncomment when auth is implemented
//       // project: req.user.activeProject // Uncomment when auth is implemented
//     };
//     // Create payment record
//     let payment = await Payments.create(paymentData);

//     // --- INVOICE GENERATION LOGIC ---
//     // // Generate a simple invoice text file (could be replaced with PDF logic)
//     const invoiceDir = path.join(__dirname, '../../uploads/invoices/');
//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir, { recursive: true });
//     }
//     const invoiceFilename = `invoice-${payment._id}.txt`;
//     const invoicePath = path.join('uploads/invoices', invoiceFilename);
//     const invoiceFullPath = path.join(invoiceDir, invoiceFilename);
//     // Simple invoice content
//     const invoiceContent = `INVOICE\nPayment ID: ${payment._id}\nAmount: ${payment.amount}\nMethod: ${payment.paymentMethod}\nTransaction ID: ${payment.transactionId}\nDate: ${payment.paymentDate}\nStatus: ${payment.status}`;
//     fs.writeFileSync(invoiceFullPath, invoiceContent);

//     // Update payment with invoice path
//     payment.invoiceDocument = invoicePath;
//     await payment.save();

//     // Return success response
//     res.status(200).send({
//       success:true,
//       message: 'Payment submitted !',
//       payment: {
//         id: payment._id,
//         amount: payment.amount,
//         method: payment.mode,
//         transactionId: payment.transactionId,
//         date: payment.paymentDate,
//         status: payment.status,
//         proofDocument: payment.proofDocument,
//         invoice: payment.invoiceDocument || null
//       }
//     });
//   } catch (error) {
//     console.error('Payment creation error:', error);
//     // cleanupFile(filePath);
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         message: 'Validation error',
//         errors: error.errors
//       });
//     }
//     res.status(500).json({
//       message: 'Payment submission failed',
//       error: error.message
//     });
//   }
// };

// module.exports = createClientPayment



// new code

const path = require("path");
const Client = require("../../Schema/client.schema/client.model");
const Payments = require("../../Schema/recivedPayments.Schema/payment.model");
const fs = require('fs');

const createClientPayment = async (req, res) => {
    const email = req.query.email;

    // Updated to match your frontend form fields
    const { 
        siteName, 
        client, 
        amount, 
        method, 
        date, 
        remarks 
    } = req.body;
    

    const proofDocument = req.file;
    
    console.log('Received payment data:', req.body);

    // Validate required fields
    if (!siteName || !client || !amount || !method) {
        return res.status(400).json({
            success: false,
            message: 'Site name, client, amount, and payment method are required.'
        });
    }

    try {
        // Find client by name (since client name is auto-populated from site selection)
        let user = await Client.findOne({ name: client });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Generate a transaction ID if not provided (you might want to change this logic)
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

        // Prepare payment data according to new form fields
        const paymentData = {
            clientId: user._id,
            clientName: client,
            siteName: siteName,
            amount: parseFloat(amount),
            mode: method,
            transactionDate: date ? new Date(date) : new Date(),
            transactionId: transactionId,
            remarks: remarks || '',
            status: 'pending',
            // proofDocument: proofDocument, // Uncomment if you're using file upload
        };

        // Create payment record
        let payment = await Payments.create(paymentData);

        // Update client's payment information
        await Client.findByIdAndUpdate(user._id, {
            $inc: { 
                total_payment: parseFloat(amount),
                balance_amount: parseFloat(amount)
            },
            lastPayment: parseFloat(amount),
            last_payment: new Date()
        });

        // --- INVOICE GENERATION LOGIC (Optional) ---
        const invoiceDir = path.join(__dirname, '../../uploads/invoices/');
        if (!fs.existsSync(invoiceDir)) {
            fs.mkdirSync(invoiceDir, { recursive: true });
        }
        
        const invoiceFilename = `invoice-${payment._id}.txt`;
        const invoicePath = path.join('uploads/invoices', invoiceFilename);
        const invoiceFullPath = path.join(invoiceDir, invoiceFilename);
        
        const invoiceContent = `INVOICE\nPayment ID: ${payment._id}\nClient: ${client}\nSite: ${siteName}\nAmount: ${amount}\nMethod: ${method}\nTransaction ID: ${transactionId}\nDate: ${date}\nRemarks: ${remarks}\nStatus: ${payment.status}`;
        
        fs.writeFileSync(invoiceFullPath, invoiceContent);

        // Update payment with invoice path
        payment.receiptURL = invoicePath;
        await payment.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Payment submitted successfully!',
            payment: {
                id: payment._id,
                client: payment.clientName,
                site: payment.siteName,
                amount: payment.amount,
                method: payment.mode,
                transactionId: payment.transactionId,
                date: payment.transactionDate,
                remarks: payment.remarks,
                status: payment.status
            }
        });

    } catch (error) {
        console.error('Payment creation error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Payment submission failed',
            error: error.message
        });
    }
};

module.exports = createClientPayment;


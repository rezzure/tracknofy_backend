const Client = require("../../Schema/client.schema/client.model");
const Payments = require("../../Schema/recivedPayments.Schema/payment.model")

const createClientPayment = async (req, res) => {
  const email = req.query.email
  console.log(req.body)
  const { amount, paymentMethod, transactionId, date } = req.body;
  const proofDocument = req.file;
  console.log(proofDocument);
  
 
  // // Validate required fields
  // if (!amount || !transactionId || !proofDocument) {
  //   return res.status(400).json({
  //     message: 'Amount, transaction ID, and payment proof are required.'
  //   });
  // }
  
  
  try {
    // Prepare payment data
    let user = await Client.findOne({email:email})
    const paymentData = {
      amount: amount,
      mode: paymentMethod || 'UPI',
      transactionId: transactionId.trim(),
      transactionDate: date || new Date().toISOString(),
      proofDocument: proofDocument,
      status: 'pending',
      clientId:user._id,
      clientName:user.name,
      siteName:user.sitename,

      // client: req.user._id, // Uncomment when auth is implemented
      // project: req.user.activeProject // Uncomment when auth is implemented
    };
    // Create payment record
    let payment = await Payments.create(paymentData);

    // --- INVOICE GENERATION LOGIC ---
    // // Generate a simple invoice text file (could be replaced with PDF logic)
    // const invoiceDir = path.join(__dirname, '../../uploads/invoices/');
    // if (!fs.existsSync(invoiceDir)) {
    //   fs.mkdirSync(invoiceDir, { recursive: true });
    // }
    // const invoiceFilename = `invoice-${payment._id}.txt`;
    // const invoicePath = path.join('uploads/invoices', invoiceFilename);
    // const invoiceFullPath = path.join(invoiceDir, invoiceFilename);
    // // Simple invoice content
    // const invoiceContent = `INVOICE\nPayment ID: ${payment._id}\nAmount: ${payment.amount}\nMethod: ${payment.paymentMethod}\nTransaction ID: ${payment.transactionId}\nDate: ${payment.paymentDate}\nStatus: ${payment.status}`;
    // fs.writeFileSync(invoiceFullPath, invoiceContent);

    // Update payment with invoice path
    // payment.invoiceDocument = invoicePath;
    // await payment.save();

    // Return success response
    res.status(201).json({
      message: 'Payment submitted successfully! Status: Pending Verification',
      payment: {
        id: payment._id,
        amount: payment.amount,
        method: payment.mode,
        transactionId: payment.transactionId,
        date: payment.paymentDate,
        status: payment.status,
        proofDocument: payment.proofDocument,
        invoice: payment.invoiceDocument || null
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    // cleanupFile(filePath);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    }
    res.status(500).json({
      message: 'Payment submission failed',
      error: error.message
    });
  }
};

module.exports = createClientPayment
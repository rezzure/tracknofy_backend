const Admin = require("../../Schema/admin.schema/admine.model");
const FinancialDetail = require("../../Schema/clientFinancialDetail.schema/clientFinancialDetail.model");

// Create Financial Detail
const createFinancialDetail = async (req, res) => {
  try {
    const { clientName, siteName, gstNo, bankAccNo, ifscCode } = req.body;
    console.log(clientName, siteName, gstNo, bankAccNo, ifscCode)
    const email = req.query.email
    console.log(email)

    // const createdBy = req.user.id; // Assuming you have user info in req.user from auth middleware
    // console.log(createdBy)
    const admin = await Admin.findOne({email:email})
    console.log(admin)



    // Check if GST number already exists
    let existingFinancial = await FinancialDetail.findOne({ gstNo });
    if (existingFinancial) {
      return res.send({
        success: false,
        message: "GST Number Already Exists",
      });
    }

    // Check if combination of client and site already exists
    existingFinancial = await FinancialDetail.findOne({ 
      clientName, 
      siteName 
    });
    if (existingFinancial) {
      return res.send({
        success: false,
        message: "Financial details for this client and site combination already exist",
      });
    }

    // Create financial detail
    const financialData = {
      clientName: clientName,
      siteName: siteName,
      gstNo: gstNo.toUpperCase(), // Convert to uppercase for consistency
      bankAccNo: bankAccNo,
      ifscCode: ifscCode.toUpperCase(), // Convert to uppercase for consistency
      createdBy: admin._id
    };

    const financialDetail = await FinancialDetail.create(financialData);

    res.send({
      success: true,
      message: "Financial Detail Created Successfully",
      data: financialDetail,
    });
  } catch (error) {
    console.error("Error creating financial detail:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.send({
        success: false,
        message: "Financial detail with this GST number already exists",
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.send({
        success: false,
        message: messages.join(', '),
      });
    }

    res.send({
      success: false,
      message: "Error creating financial detail",
      error: error.message,
    });
  }
}

// Get All Financial Details
const getFinancialDetails = async (req, res) => {
  try {
    const financialDetails = await FinancialDetail.find()
      .populate('createdBy', 'name email') // Populate creator info
      .sort({ createdAt: -1 }); // Sort by latest first

    if (!financialDetails || financialDetails.length === 0) {
      return res.send({
        success: false,
        message: "No financial details found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Financial details fetched successfully",
      number_of_records: financialDetails.length,
      data: financialDetails,
    });
  } catch (err) {
    console.error("Error fetching financial details:", err);
    res.status(500).send({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
}

// Update Financial Detail
const editFinancialDetail = async (req, res) => {
  const { id } = req.params;
  const { clientName, siteName, gstNo, bankAccNo, ifscCode } = req.body;
  
  try {
    const financialDetail = await FinancialDetail.findById(id);
    if (!financialDetail) {
      return res.status(404).send({
        success: false,
        message: "Financial Detail Not Found"
      });
    }

    // Check if GST number is being changed and if it already exists
    if (gstNo && gstNo !== financialDetail.gstNo) {
      const existingGST = await FinancialDetail.findOne({ gstNo: gstNo.toUpperCase() });
      if (existingGST) {
        return res.send({
          success: false,
          message: "GST Number Already Exists"
        });
      }
      financialDetail.gstNo = gstNo.toUpperCase();
    }

    // Check if client-site combination is being changed and if it already exists
    if ((clientName && clientName !== financialDetail.clientName) || 
        (siteName && siteName !== financialDetail.siteName)) {
      const existingCombination = await FinancialDetail.findOne({ 
        clientName: clientName || financialDetail.clientName, 
        siteName: siteName || financialDetail.siteName 
      });
      if (existingCombination && existingCombination._id.toString() !== id) {
        return res.send({
          success: false,
          message: "Financial details for this client and site combination already exist"
        });
      }
    }

    // Update fields if provided
    if (clientName) financialDetail.clientName = clientName;
    if (siteName) financialDetail.siteName = siteName;
    if (bankAccNo) financialDetail.bankAccNo = bankAccNo;
    if (ifscCode) financialDetail.ifscCode = ifscCode.toUpperCase();

    financialDetail.updatedAt = Date.now();

    await financialDetail.save();

    res.status(200).send({
      success: true,
      message: "Financial Detail Updated Successfully",
      data: financialDetail
    });
  } catch (error) {
    console.error("Error updating financial detail:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).send({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).send({
      success: false,
      message: `Internal Server Error: ${error.message}`
    });
  }
}

// Delete Financial Detail
const deleteFinancialDetail = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting financial detail with ID:", id);
    
    const financialDetail = await FinancialDetail.findByIdAndDelete(id);
    
    if (!financialDetail) {
      return res.status(404).send({
        success: false,
        message: "Financial detail not found"
      });
    }

    return res.status(200).send({
      success: true,
      message: "Financial detail deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting financial detail:", error);
    return res.status(500).send({
      success: false,
      message: "Error: " + error.message
    });
  }
}

// Get Single Financial Detail by ID
const getFinancialDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const financialDetail = await FinancialDetail.findById(id)
      .populate('createdBy', 'name email');
    
    if (!financialDetail) {
      return res.status(404).send({
        success: false,
        message: "Financial detail not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Financial detail fetched successfully",
      data: financialDetail
    });
  } catch (error) {
    console.error("Error fetching financial detail:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error: " + error.message
    });
  }
}

module.exports = {
  createFinancialDetail,
  getFinancialDetails,
  editFinancialDetail,
  deleteFinancialDetail,
  getFinancialDetailById
};
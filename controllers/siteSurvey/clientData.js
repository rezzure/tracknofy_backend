const ClientData = require("../../Schema/survey.schema/clientData.model");



// Submit client data
exports.submitClient = async (req, res) => {
  try {
    const { name, email, mobile, address, siteShortName } = req.body;
    console.log(name, email, mobile, address, siteShortName,"hello")

    // Check if client already exists
    const existingClient = await ClientData.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client already exists with this email'
      });
    }

    // Create new client
    const client = new ClientData({
      name,
      email,
      mobile,
      address: address || '',
      siteShortName
    });

    const savedClient = await client.save();

    res.status(201).json({
      success: true,
      message: 'Client saved successfully',
      clientId: savedClient._id,
      client: savedClient
    });

  } catch (error) {
    console.error('Error saving client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get client by email
exports.getClient = async (req, res) => {
  try {
    const { email } = req.body;
    
    const client = await ClientData.findOne({ email });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      client: client
    });

  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
const ClientData = require('../../Schema/survey.schema/clientData.model');

// Submit client data
const submitClientData = async (req, res) => {
  try {
    const { clientName, clientEmail, clientMobile, siteAddress, siteShortName } = req.body;
    console.log(clientName, clientEmail, clientMobile, siteAddress, siteShortName)

    // Validate required fields
    if (!clientEmail || clientEmail.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Client email is required'
      });
    }

    // Get user email from token (assuming you have authentication middleware)
    const userEmail = req.query.email || req.body.email;
    // console.log(userEmail)
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    // Check if client with same email already exists
    const existingClient = await ClientData.findOne({ 
      clientEmail: clientEmail.toLowerCase(),
      createdBy: userEmail
    });

    if (existingClient) {
      // Update existing client
      const updatedClient = await ClientData.findByIdAndUpdate(
        existingClient._id,
        {
          clientName,
          clientMobile,
          siteAddress,
          siteShortName,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Client information updated successfully!',
        clientId: updatedClient._id,
        client: updatedClient
      });
    }

    // Create new client
    const newClient = new ClientData({
      clientName,
      clientEmail,
      clientMobile,
      siteAddress,
      siteShortName,
      createdBy: userEmail
    });

    const savedClient = await newClient.save();

    res.status(201).json({
      success: true,
      message: 'Client information saved successfully!',
      clientId: savedClient._id,
      client: savedClient
    });

  } catch (error) {
    console.error('Error submitting client data:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit client data',
      error: error.message
    });
  }
};

// Get client data by ID
const getClientData = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email;

    const client = await ClientData.findOne({ 
      _id: id, 
      createdBy: userEmail 
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      client: client
    });

  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client data',
      error: error.message
    });
  }
};

// Get all clients for a user
const getUserClients = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const clients = await ClientData.find({ createdBy: userEmail })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ClientData.countDocuments({ createdBy: userEmail });

    res.status(200).json({
      success: true,
      clients: clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user clients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients',
      error: error.message
    });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user?.email;

    const client = await ClientData.findOneAndDelete({ 
      _id: id, 
      createdBy: userEmail 
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete client',
      error: error.message
    });
  }
};

module.exports = {
  submitClientData,
  getClientData,
  getUserClients,
  deleteClient
};
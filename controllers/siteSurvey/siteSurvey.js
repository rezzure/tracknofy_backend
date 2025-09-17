
const ClientData = require('../../Schema/survey.schema/clientData.model');
const Survey = require('../../Schema/survey.schema/surveyData.model');

// Submit final survey data
exports.submitFinal = async (req, res) => {
  try {
    const { clientDetails, ...roomData } = req.body;
    console.log(clientDetails, roomData)

    // Check if client exists
    const client = await ClientData.findOne({ email: clientDetails.clientEmail });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found. Please submit client data first.'
      });
    }

    // Create survey
    const survey = new Survey({
      clientId: client._id,
      clientData: {
        name: client.name,
        email: client.email,
        mobile: client.mobile,
        address: client.address,
        siteShortName: client.siteShortName
      },
      surveyData: roomData
    });

    const savedSurvey = await survey.save();

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      submissionId: savedSurvey._id
    });

  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get survey by ID
exports.getSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    
    const survey = await Survey.findById(id).populate('clientId');
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      survey: survey
    });

  } catch (error) {
    console.error('Error getting survey:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
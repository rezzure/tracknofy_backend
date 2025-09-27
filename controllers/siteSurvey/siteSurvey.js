
// const ClientData = require('../../Schema/survey.schema/clientData.model');
// const Survey = require('../../Schema/survey.schema/surveyData.model');

// // Submit final survey data
// exports.submitFinal = async (req, res) => {
//   try {
//     const { clientDetails, ...roomData } = req.body;
//     console.log(clientDetails, roomData)
//     console.log(roomData)
//     console.log(clientDetails.clientEmail)
//     // const email
//     // Check if client exists
//     const client = await ClientData.findOne({ clientEmail: clientDetails.clientEmail });
//     console.log("hello"+client)
//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: 'Client not found. Please submit client data first.'
//       });
//     }

//     // Create survey
//     const survey = new Survey({
//       clientId: client._id,
//       clientData: {
//         name: client.clientName,
//         email: client.clientEmail,
//         mobile: client.clientMobile,
//         address: client.siteAddress,
//         siteShortName: client.siteShortName
//       },
//       surveyData: roomData
//     });

//     const savedSurvey = await survey.save();

//     res.status(201).json({
//       success: true,
//       message: 'Survey submitted successfully',
//       submissionId: savedSurvey
//     });

//   } catch (error) {
//     console.error('Error submitting survey:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Get survey by ID
// exports.getSurvey = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const survey = await Survey.findById(id).populate('clientId');
//     if (!survey) {
//       return res.status(404).json({
//         success: false,
//         message: 'Survey not found'
//       });
//     }

//     res.json({
//       success: true,
//       survey: survey
//     });

//   } catch (error) {
//     console.error('Error getting survey:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

























const ClientData = require('../../Schema/survey.schema/clientData.model');
const Survey = require('../../Schema/survey.schema/surveyData.model');

// Submit final survey data (create or update)
exports.submitFinal = async (req, res) => {
  try {
    const { clientDetails, surveyData, workItems, submissionType = 'new' } = req.body;
    console.log('Submission type:', submissionType);
    console.log('Client email:', clientDetails.clientEmail);

    // Check if client exists
    const client = await ClientData.findOne({ clientEmail: clientDetails.clientEmail });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found. Please submit client data first.'
      });
    }

    let savedSurvey;

    if (submissionType === 'update') {
      // Update existing survey - find the latest survey for this client
      const existingSurvey = await Survey.findOne({
        clientId: client._id
      }).sort({ createdAt: -1 });

      if (existingSurvey) {
        // Update the existing survey
        existingSurvey.surveyData = surveyData;
        if (workItems) {
          existingSurvey.workItems = workItems;
        }
        existingSurvey.updatedAt = Date.now();

        savedSurvey = await existingSurvey.save();
        
        console.log('Survey updated successfully:', savedSurvey._id);
      } else {
        // No existing survey found, create a new one
        const newSurvey = new Survey({
          clientId: client._id,
          clientData: {
            name: client.clientName,
            email: client.clientEmail,
            mobile: client.clientMobile,
            address: client.siteAddress,
            siteShortName: client.siteShortName
          },
          surveyData: surveyData,
          workItems: workItems || {}
        });

        savedSurvey = await newSurvey.save();
        console.log('New survey created (no existing found):', savedSurvey._id);
      }
    } else {
      // Create new survey
      const newSurvey = new Survey({
        clientId: client._id,
        clientData: {
          name: client.clientName,
          email: client.clientEmail,
          mobile: client.clientMobile,
          address: client.siteAddress,
          siteShortName: client.siteShortName
        },
        surveyData: surveyData,
        workItems: workItems || {}
      });

      savedSurvey = await newSurvey.save();
      console.log('New survey created:', savedSurvey._id);
    }

    res.status(201).json({
      success: true,
      message: submissionType === 'update' ? 'Survey updated successfully' : 'Survey submitted successfully',
      submissionId: savedSurvey._id,
      submissionType: submissionType
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

// Get all surveys for a client
exports.getSurveysByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const surveys = await Survey.find({ clientId: clientId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      surveys: surveys,
      count: surveys.length
    });

  } catch (error) {
    console.error('Error getting surveys by client:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
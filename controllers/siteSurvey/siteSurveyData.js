// const ClientData = require('../../Schema/survey.schema/clientData.model');
// const Survey = require('../../Schema/survey.schema/surveyData.model');

// // Get specific site survey data
// const getSiteData = async (req, res) => {
//   try {
//     const { siteId } = req.params;
//     const userEmail = req.query.email;

//     if (!userEmail) {
//       return res.status(400).json({
//         success: false,
//         message: 'User email is required'
//       });
//     }

//     // First, verify the client belongs to this user
//     const client = await ClientData.findOne({
//       _id: siteId,
//       createdBy: userEmail
//     });

//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         message: 'Site not found or you do not have permission to access it'
//       });
//     }

//     // Get the latest survey data for this client
//     const survey = await Survey.findOne({
//       clientId: siteId
//     }).sort({ createdAt: -1 }); // Get the most recent survey

//     if (!survey) {
//       // Return client details even if no survey data exists
//       return res.status(200).json({
//         success: true,
//         data: {
//           clientDetails: {
//             clientName: client.clientName,
//             clientEmail: client.clientEmail,
//             clientMobile: client.clientMobile,
//             siteAddress: client.siteAddress,
//             siteShortName: client.siteShortName
//           }
//         }
//       });
//     }

//     // Return both client details and survey data
//     res.status(200).json({
//       success: true,
//       data: {
//         clientDetails: survey.clientData,
//         ...survey.surveyData
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching site data:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch site data',
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   getSiteData
// };















const ClientData = require('../../Schema/survey.schema/clientData.model');
const Survey = require('../../Schema/survey.schema/surveyData.model');

// Get specific site survey data
const getSiteData = async (req, res) => {
  try {
    const { siteId } = req.params;
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    // First, verify the client belongs to this user
    const client = await ClientData.findOne({
      _id: siteId,
      createdBy: userEmail
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Site not found or you do not have permission to access it'
      });
    }

    // Get the latest survey data for this client
    const survey = await Survey.findOne({
      clientId: siteId
    }).sort({ createdAt: -1 }); // Get the most recent survey

    if (!survey) {
      // Return client details even if no survey data exists
      return res.status(200).json({
        success: true,
        data: {
          clientDetails: {
            clientName: client.clientName,
            clientEmail: client.clientEmail,
            clientMobile: client.clientMobile,
            siteAddress: client.siteAddress,
            siteShortName: client.siteShortName,
            _id: client._id
          }
        }
      });
    }

    // Return both client details and survey data
    res.status(200).json({
      success: true,
      data: {
        clientDetails: {
          ...survey.clientData,
          _id: client._id
        },
        ...survey.surveyData,
        workItems: survey.workItems || {},
        surveyId: survey._id,
        createdAt: survey.createdAt,
        updatedAt: survey.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching site data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site data',
      error: error.message
    });
  }
};

module.exports = {
  getSiteData
};
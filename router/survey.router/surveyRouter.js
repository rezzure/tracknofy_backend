// const express = require('express');
// const router = express.Router();

// const verification = require('../../middleware/verification');
// const {
//   submitClientData,
//   getClientData,
//   getUserClients,
//   deleteClient,
//   getAllSites,           // Add this
//   updateSiteClientData   // Add this
// } = require("../../controllers/siteSurvey/clientData");

// const { getSiteData } = require("../../controllers/siteSurvey/siteSurveyData"); // Add this
// const { submitFinal, getSurvey } = require('../../controllers/siteSurvey/siteSurvey');

// // Existing routes
// router.post('/clientData/submit', submitClientData);
// router.post('/submit/final', verification, submitFinal);
// router.get('/survey/:id', verification, getSurvey);

// // New routes for Sites Dashboard
// router.get('/sites/all', verification, getAllSites);                    // Get all sites
// router.get('/sites/:siteId', verification, getSiteData);               // Get specific site data
// router.put('/sites/:siteId/client', verification, updateSiteClientData); // Update site client data

// module.exports = router;














// 1. Import Express framework and create a router instance
const express = require('express');
const router = express.Router();

// 2. Import middleware for token verification
const verification = require('../../middleware/verification');

// 3. Import controller functions for client data operations
// Using destructuring to import specific functions from the clientData controller
const {
  submitClientData,    // Function to create new client data
  getClientData,       // Function to get specific client data by ID
  getUserClients,      // Function to get all clients for a user
  deleteClient,        // Function to delete a client record
  getAllSites,         // Function to get all sites for dashboard display
  updateSiteClientData // Function to update existing client information
} = require("../../controllers/siteSurvey/clientData");

// 4. Import controller function for getting site survey data
// Importing getSiteData function from siteSurveyData controller
const { getSiteData } = require("../../controllers/siteSurvey/siteSurveyData");

// 5. Import controller functions for final survey submission and retrieval
// Importing submitFinal and getSurvey functions from siteSurvey controller
const { submitFinal, getSurvey } = require('../../controllers/siteSurvey/siteSurvey');

// 6. Define route for submitting client data (client information form)
// POST request to '/api/clientData/submit'
// No authentication middleware (verification) applied - allows unauthenticated submissions
router.post('/clientData/submit', submitClientData);

// 7. Define route for submitting final survey data (room data + work items)
// POST request to '/api/submit/final'
// Protected route - requires token verification before accessing
router.post('/submit/final', verification, submitFinal);

// 8. Define route for retrieving a specific survey by ID
// GET request to '/api/survey/:id' where :id is the survey ID parameter
// Protected route - requires token verification
router.get('/survey/:id', verification, getSurvey);

// 9. Define route for getting all sites for the authenticated user
// GET request to '/api/sites/all'
// Protected route - requires token verification
// Used in the Sites Dashboard to display all surveys
router.get('/sites/all', verification, getAllSites);

// 10. Define route for getting detailed data for a specific site
// GET request to '/api/sites/:siteId' where :siteId is the site ID parameter
// Protected route - requires token verification
// Used when viewing or editing a specific survey
router.get('/sites/:siteId', verification, getSiteData);

// 11. Define route for updating client information of an existing site
// PUT request to '/api/sites/:siteId/client' where :siteId is the site ID parameter
// Protected route - requires token verification
// Used when editing client details of an existing survey
router.put('/sites/:siteId/client', verification, updateSiteClientData);

// 12. Export the router to be used in the main Express application
module.exports = router;
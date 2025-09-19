const express = require('express');
const router = express.Router();

const verification = require('../../middleware/verification');
const {
  submitClientData,
  getClientData,
  getUserClients,
  deleteClient,
  getAllSites,           // Add this
  updateSiteClientData   // Add this
} = require("../../controllers/siteSurvey/clientData");

const { getSiteData } = require("../../controllers/siteSurvey/siteSurveyData"); // Add this
const { submitFinal, getSurvey } = require('../../controllers/siteSurvey/siteSurvey');

// Existing routes
router.post('/clientData/submit', submitClientData);
router.post('/submit/final', verification, submitFinal);
router.get('/survey/:id', verification, getSurvey);

// New routes for Sites Dashboard
router.get('/sites/all', verification, getAllSites);                    // Get all sites
router.get('/sites/:siteId', verification, getSiteData);               // Get specific site data
router.put('/sites/:siteId/client', verification, updateSiteClientData); // Update site client data

module.exports = router;
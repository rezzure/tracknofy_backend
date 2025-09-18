const express = require('express');
const router = express.Router();

const verification = require('../../middleware/verification');
// const { submitClient, getClient } = require('../../controllers/siteSurvey/clientData');
const {submitClientData,
  getClientData,
  getUserClients,
  deleteClient} = require("../../controllers/siteSurvey/clientData")
const { submitFinal, getSurvey } = require('../../controllers/siteSurvey/siteSurvey');

// POST /api/client/submit - Submit client data
router.post('/clientData/submit', submitClientData);

// POST /api/client/get - Get client data by email
// router.get('/client/get',verification, getClient);

// POST /api/survey/final - Submit final survey data
router.post('/submit/final',verification, submitFinal);

// GET /api/survey/:id - Get survey by ID
router.get('/survey/:id',verification, getSurvey);

module.exports = router
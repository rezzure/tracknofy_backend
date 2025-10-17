const express = require('express');
const router = express.Router();
const {
  createFormSubmission,
  getFormSubmissions,
  getFormSubmissionById,
  updateFormSubmission,
  deleteFormSubmission
} = require('../../controllers/myFormController/myFormController');

// Create a new form submission
router.post('/create/myform/submission', createFormSubmission);

// Get all form submissions for a user
router.get('/get/myform/submissions', getFormSubmissions);

// Get a single form submission by ID
router.get('/get/myform/submission/:_id', getFormSubmissionById);

// Update a form submission
router.put('/update/myform/submission/:_id', updateFormSubmission);

// Delete a form submission
router.delete('/delete/myform/submission/:_id', deleteFormSubmission);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const myFormController = require('../../controllers/myFormController/myFormController');
// const { body } = require('express-validator');

// // Validation rules
// const formSubmissionValidation = [
//   body('formId')
//     .notEmpty()
//     .withMessage('Form ID is required'),
//   body('formName')
//     .notEmpty()
//     .withMessage('Form name is required'),
//   body('formFields')
//     .isArray()
//     .withMessage('Form fields must be an array'),
//   body('formResponses')
//     .isObject()
//     .withMessage('Form responses must be an object'),
//   body('submittedBy')
//     .notEmpty()
//     .withMessage('Submitted by is required'),
//   body('module')
//     .notEmpty()
//     .withMessage('Module is required')
// ];

// // Routes
// router.post('/create/myform/submission', formSubmissionValidation, myFormController.createFormSubmission);
// router.get('/get/myform/submissions', myFormController.getFormSubmissions);
// router.get('/get/myform/submission/:id', myFormController.getFormSubmissionById);
// router.put('/update/myform/submission/:id', myFormController.updateFormSubmission);
// router.delete('/delete/myform/submission/:id', myFormController.deleteFormSubmission);

// module.exports = router;





// previous controller


// const express = require('express');
// const router = express.Router();
// const myFormController = require('../../controllers/myFormController/myFormController');
// const { body } = require('express-validator');

// // Validation rules
// const formSubmissionValidation = [
//   body('formId')
//     .notEmpty()
//     .withMessage('Form ID is required'),
//   body('formName')
//     .notEmpty()
//     .withMessage('Form name is required'),
//   body('formFields')
//     .isArray()
//     .withMessage('Form fields must be an array'),
//   body('formResponses')
//     .isObject()
//     .withMessage('Form responses must be an object'),
//   body('submittedBy')
//     .notEmpty()
//     .withMessage('Submitted by is required'),
//   body('module')
//     .notEmpty()
//     .withMessage('Module is required')
// ];

// // Routes
// router.post('/create/myform/submission', formSubmissionValidation, myFormController.createFormSubmission);
// router.get('/get/myform/submissions', myFormController.getFormSubmissions);
// router.get('/get/myform/submission/:id', myFormController.getFormSubmissionById);
// router.put('/update/myform/submission/:id', myFormController.updateFormSubmission);
// router.delete('/delete/myform/submission/:id', myFormController.deleteFormSubmission);

// module.exports = router;



// last router

const express = require('express');
const router = express.Router();
const {
  createFormSubmission,
  getFormSubmissions,
  getFormSubmissionById,
  updateFormSubmission,
  deleteFormSubmission
} = require('../../controllers/myFormController/myFormController');

// @route   POST /api/create/myform/submission
// @desc    Create a new form submission
// @access  Private
router.post('/create/myform/submission', createFormSubmission);

// @route   GET /api/get/myform/submissions
// @desc    Get all form submissions for a user
// @access  Private
router.get('/get/myform/submissions', getFormSubmissions);

// @route   GET /api/get/myform/submission/:_id
// @desc    Get a single form submission by ID
// @access  Private
router.get('/get/myform/submission/:_id', getFormSubmissionById);

// @route   PUT /api/update/myform/submission/:_id
// @desc    Update a form submission
// @access  Private
router.put('/update/myform/submission/:_id', updateFormSubmission);

// @route   DELETE /api/delete/myform/submission/:_id
// @desc    Delete a form submission
// @access  Private
router.delete('/delete/myform/submission/:_id', deleteFormSubmission);

module.exports = router;


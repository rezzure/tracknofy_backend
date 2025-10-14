// const express = require('express');
// const router = express.Router();
// const formController = require('../../controllers/formController/formController');


// router.get('/get/form', formController.getAllForms);
// router.get('/get/form/:_id', formController.getFormById);
// router.post('/create/form', formController.createForm);
// router.put('/update/form/:_id', formController.updateForm);
// router.delete('/delete/form/:_id', formController.deleteForm);

// module.exports = router;



// updates for my form

const express = require('express');
const router = express.Router();
const formController = require('../../controllers/formController/formController');


router.get('/get/form', formController.getAllForms);
router.get('/get/form/:_id', formController.getFormById);
router.post('/create/form', formController.createForm);
router.put('/update/form/:_id', formController.updateForm);
router.delete('/delete/form/:_id', formController.deleteForm);

// NEW: My Forms routes
router.post('/assign/my-forms', formController.assignToMyForms);
router.get('/get/user-forms', formController.getFormsByUserAndModule);

module.exports = router;
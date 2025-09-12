const express = require('express');
const router = express.Router();
const formController = require('../../controllers/formController/formController');


router.get('/get/form', formController.getAllForms);
router.get('/get/form/:_id', formController.getFormById);
router.post('/create/form', formController.createForm);
router.put('/update/form/:_id', formController.updateForm);
router.delete('/delete/form/:_id', formController.deleteForm);

module.exports = router;
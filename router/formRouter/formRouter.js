const express = require('express');
const router = express.Router();
const formController = require('../../controllers/formController/formController');


router.get('/', formController.getAllForms);
router.get('/:id', formController.getFormById);
router.post('/', formController.createForm);
router.put('/:id', formController.updateForm);
router.delete('/:id', formController.deleteForm);

module.exports = router;
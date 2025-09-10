const express = require('express');
const router = express.Router();
const fileController = require('../../controllers/fileController/fileController');
const upload = require('../../middleware/dynamicForm.multer/multer');

router.post('/upload', upload.single('image'), fileController.uploadFile);

module.exports = router;
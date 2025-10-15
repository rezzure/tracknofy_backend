const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DMSController = require('../../controllers/DMSController/DMS.controller');
const verification = require('../../middleware/verification');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Routes
router.get('/items',verification, DMSController.getItems);
router.post('/items/folder',verification, DMSController.createFolder);
router.post('/items/upload',verification, upload.array('files'), DMSController.uploadFiles);
router.put('/items/:id/rename',verification, DMSController.renameItem);
router.delete('/items/:id',verification, DMSController.deleteItem);
router.get('/items/:id/download',verification, DMSController.downloadFile);
router.post('/items/:id/assign',verification, DMSController.assignUser);
router.get('/user-items/:userEmail',verification, DMSController.getUserItems);

module.exports = router;
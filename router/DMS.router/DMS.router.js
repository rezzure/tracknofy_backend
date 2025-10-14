const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getItems,
  createFolder,
  uploadFiles,
  renameItem,
  deleteItem,
  downloadFile
} = require('../../controllers/DMSController/DMS.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/items/', getItems);
router.post('/items/folder', createFolder);
router.post('/items/upload', upload.array('files'), uploadFiles); // 'files' is the field name
router.put('/items/:id/rename', renameItem);
router.delete('/items/:id', deleteItem);
router.get('/items/:id/download', downloadFile);


module.exports = router;
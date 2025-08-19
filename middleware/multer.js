const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = './public/uploads/';
    
    // Create directory if not exists
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, uploadDir);
    });
  },
  filename: function(req, file, cb) {
    let ext = path.extname(file.originalname); // Get file extension (e.g., .jpg)
    let filename = file.fieldname + '-' + Date.now() + ext; // Generate unique filename
    cb(null, filename); // Save the file
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
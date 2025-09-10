const FileUpload = require('../../middleware/dynamicForm.multer/multer');

// File upload endpoint
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const fileUpload = new FileUpload({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      fieldId: req.body.fieldId
    });
    
    const savedFile = await fileUpload.save();
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId: savedFile._id,
        filename: savedFile.filename,
        originalName: savedFile.originalName,
        url: `/uploads/${savedFile.filename}`,
        size: savedFile.size
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};
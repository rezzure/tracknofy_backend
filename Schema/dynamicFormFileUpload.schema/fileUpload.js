const mongoose = require('mongoose');

const FileUploadSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  size: Number,
  mimetype: String,
  fieldId: String,
  formId: mongoose.Schema.Types.ObjectId,
  submissionId: mongoose.Schema.Types.ObjectId
}, {
  timestamps: true
});


const FileUpload = mongoose.model('FileUpload', FileUploadSchema);
module.exports = FileUpload
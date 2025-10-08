const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  siteId: {
    type: String, // or mongoose.Schema.Types.ObjectId if referencing
    required: true
  },
  siteName: {
    type: String,
    required: true,
    trim: true
  },
  scopeOfWork: {
    type: String,
    required: true,
    enum: ['BedRoom', 'Kitchen', 'Living Room', 'Bathroom', 'Office', 'Garden', 'Exterior', 'Other'],
    trim: true
  },
  workItem: {
    type: String,
    required: true,
    enum: ['Flooring', 'Ceiling', 'Wall', 'Electrical', 'Plumbing', 'Furniture', 'Lighting', 'Other'],
    trim: true
  },
  workType: {
    type: String,
    required: true,
    trim: true
  },
  imageType: {
    type: String,
    required: true,
    enum: ['2D', '3D', 'PDF'],
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: String,
    trim: true
  },
  image: {
    fieldname: String,
    originalname: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['image', 'pdf'],
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'approved', 'rejected', 'review'],
    default: 'pending'
  },
  versionNumber: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Design', designSchema);
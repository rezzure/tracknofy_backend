
const mongoose = require('mongoose');

const materialItemSchema = new mongoose.Schema({
  materialType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  materialBrand: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    enum: ['bags', 'kg', 'tons', 'liters', 'pieces', 'meter', 'feet', 'inches', 'cubicYards'],
    default: 'bags'
  },
  remarks: {
    type: String,
    default: ''
  }
});

const materialRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  siteId: {
    type: String,
    required: true
  },
  siteName: {
    type: String,
    required: true
  },
  engineer: {
    type: String,
    required: true
  },
  engineerEmail: {
    type: String,
    required: true
  },
  materials: [materialItemSchema],
  requiredBy: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'assigned'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

materialRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MaterialRequest = mongoose.model('MaterialRequest', materialRequestSchema);

module.exports = MaterialRequest;
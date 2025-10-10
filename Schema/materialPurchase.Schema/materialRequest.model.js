const mongoose = require('mongoose');

const materialItemSchema = new mongoose.Schema({
  materialType: {
    type: String,
    required: true
  },
  name: {
    type: String,
    // required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    enum: ['bags', 'kg', 'tons', 'liters', 'pieces'],
    default: 'bags'
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
    // required: true
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

module.exports=MaterialRequest;
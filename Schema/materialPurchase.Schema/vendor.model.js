const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true
  },
  address: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  specialization: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

 const Vendor = mongoose.model('Vendor', vendorSchema);

 module.exports=Vendor;
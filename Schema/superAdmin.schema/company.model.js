const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  companyAddress: {
    type: String,
    required: true,
    trim: true
  },
  companyContactNo: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: null
  },
  noOfUsers: {
    type: Number,
    required: true,
    min: 1
  },
  status : {
    type : String,
    enum : ['Active', 'InActive'],
    default : 'Active'
  },
  isActive: {
    type: Boolean,
    default: true
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

companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Company = mongoose.model('Company', companySchema);

module.exports=Company;
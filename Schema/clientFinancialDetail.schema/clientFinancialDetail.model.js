const mongoose = require("mongoose");

const financialDetailSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    enum: ['xyz', 'abc', 'fdj'],
    maxlength: [50, 'Client name cannot exceed 50 characters']
  },
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    enum: ['site a', 'site b', 'site c'],
    maxlength: [50, 'Site name cannot exceed 50 characters']
  },
  gstNo: {
    type: String,
    required: [true, 'GST number is required'],
    trim: true,
    unique: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please fill a valid GST number']
  },
  bankAccNo: {
    type: String,
    required: [true, 'Bank account number is required'],
    trim: true,
    match: [/^[0-9]{9,18}$/, 'Please fill a valid bank account number']
  },
  ifscCode: {
    type: String,
    required: [true, 'IFSC code is required'],
    trim: true,
    match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please fill a valid IFSC code']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Update the updatedAt field before saving
financialDetailSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const FinancialDetail = mongoose.model("FinancialDetail", financialDetailSchema);
module.exports = FinancialDetail;
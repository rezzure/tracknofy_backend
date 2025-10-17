//  Master Company Schema (Main Database)

const mongoose = require('mongoose');

const masterCompanySchema = new mongoose.Schema({
  // Company Identification
  companyId: {
    type: String,
    required: true,
    unique: true,
    immutable: true
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    unique: true,
    maxlength: [100, "Company name cannot exceed 100 characters"]
  },
  
  // Company Details
  companyAddress: {
    type: String,
    required: [true, "Company address is required"],
    trim: true,
    maxlength: [500, "Company address cannot exceed 500 characters"]
  },
  companyContactNo: {
    type: String,
    required: [true, "Company contact number is required"],
    trim: true
  },
  companyGST: {
    type: String,
    trim: true,
    uppercase: true,
    sparse: true
  },
  companyLogo: {
    type: String,
    default: null
  },
  noOfUsers: {
    type: Number,
    required: [true, "Number of users is required"],
    min: [1, "Number of users must be at least 1"],
    max: [1000, "Number of users cannot exceed 1000"],
    default: 5
  },
  
  // Database Configuration
  databaseName: {
    type: String,
    required: true,
    unique: true,
    immutable: true
  },
  databaseStatus: {
    type: String,
    enum: ['Creating', 'Active', 'Inactive', 'Suspended'],
    default: 'Creating'
  },
  
  // Pricing Plan & Features
  pricingPlan: {
    type: String,
    required: true,
    enum: ['silver', 'golden', 'diamond', 'custom'],
    default: 'silver'
  },
  features: [{
    featureName: String,
    featuresCategories: String,
    path: String,
    icon: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  customPricing: {
    silver: { type: Number, default: 99 },
    golden: { type: Number, default: 199 },
    diamond: { type: Number, default: 399 },
    custom: { type: Number, default: 0 }
  },
  
  // Admin Configuration
  adminName: {
    type: String,
    required: [true, "Admin name is required"],
    trim: true,
    maxlength: [50, "Admin name cannot exceed 50 characters"]
  },
  adminContactNo: {
    type: String,
    required: [true, "Admin contact number is required"],
    trim: true
  },
  adminEmail: {
    type: String,
    required: [true, "Admin email is required"],
    trim: true,
    lowercase: true
  },
  adminPassword: {
    type: String,
    required: [true, "Admin password is required"]
  },
  
  // Subscription & Status
  status: {
    type: String,
    enum: ['Active', 'InActive', 'Suspended'],
    default: 'Active'
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  },
  
  // System Fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Monitoring
  lastBackup: Date,
  storageUsed: {
    type: Number,
    default: 0
  },
  activeUsers: {
    type: Number,
    default: 0
  }
});

// Pre-save middleware to generate company ID and database name
masterCompanySchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate unique company ID
    if (!this.companyId) {
      this.companyId = 'COMP' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    
    // Generate database name
    if (!this.databaseName) {
      const sanitizedName = this.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      this.databaseName = `smt_${this.companyId}_${sanitizedName}`;
    }
  }
  
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
masterCompanySchema.index({ companyId: 1 });
masterCompanySchema.index({ databaseName: 1 });
masterCompanySchema.index({ status: 1 });
masterCompanySchema.index({ expiryDate: 1 });

module.exports = mongoose.model('MasterCompany', masterCompanySchema);
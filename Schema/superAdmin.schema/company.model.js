
// const mongoose = require('mongoose');

// const companySchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: [true, "Company name is required"],
//     trim: true,
//     unique: [true, "Company name already exists"],
//     maxlength: [100, "Company name cannot exceed 100 characters"]
//   },
//   companyAddress: {
//     type: String,
//     required: [true, "Company address is required"],
//     trim: true,
//     maxlength: [500, "Company address cannot exceed 500 characters"]
//   },
//   companyContactNo: {
//     type: String,
//     required: [true, "Company contact number is required"],
//     trim: true,
//     // match: [/^[0-9]{10,15}$/, "Please enter a valid contact number (10-15 digits)"]
//   },
//   companyGST: {
//     type: String,
//     // required: [true, "Company GST number is required"],
//     trim: true,
//     uppercase: true,
//     unique: [true, "GST number already exists"],
//     // match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, "Please enter a valid GST number"]
//   },
//   companyLogo: {
//     type: String,
//     default: null
//   },
//   noOfUsers: {
//     type: Number,
//     required: [true, "Number of users is required"],
//     min: [1, "Number of users must be at least 1"],
//     max: [1000, "Number of users cannot exceed 1000"]
//   },
//   status: {
//     type: String,
//     enum: {
//       values: ['Active', 'InActive'],
//       message: "Status must be either Active or InActive"
//     },
//     default: 'Active'
//   },
//   adminEmail: {
//     type: String,
//     required: [true, "Admin email is required"],
//     trim: true,
//     lowercase: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// companySchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const Company = mongoose.model('Company', companySchema);
// module.exports = Company;




const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Basic Company Information
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    unique: [true, "Company name already exists"],
    maxlength: [100, "Company name cannot exceed 100 characters"],
    match: [/^[a-zA-Z\s\-&.,()]+$/, "Company name should contain only letters, spaces, and basic punctuation"]
  },
  companyAddress: {
    type: String,
    required: [true, "Company address is required"],
    trim: true,
    minlength: [10, "Address should be at least 10 characters long"],
    maxlength: [500, "Company address cannot exceed 500 characters"]
  },
  companyContactNo: {
    type: String,
    required: [true, "Company contact number is required"],
    trim: true,
    match: [/^\d{10,15}$/, "Please enter a valid contact number (10-15 digits)"]
  },
  companyGST: {
    type: String,
    trim: true,
    uppercase: true,
    sparse: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, "Please enter a valid GST number format"]
  },
  companyLogo: {
    type: String,
    default: null
  },

  // Admin Information (Embedded for quick access)
  adminName: {
    type: String,
    // required: [true, "Admin name is required"],
    trim: true,
    maxlength: [50, "Admin name cannot exceed 50 characters"],
    match: [/^[a-zA-Z\s]+$/, "Admin name should contain only letters and spaces"]
  },
  adminContactNo: {
    type: String,
    required: [true, "Admin contact number is required"],
    trim: true,
    match: [/^\d{10,15}$/, "Please enter a valid contact number (10-15 digits)"]
  },
  adminEmail: {
    type: String,
    required: [true, "Admin email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address"
    ]
  },

  // Pricing & Plan Information
  pricingPlan: {
    type: String,
    required: [true, "Pricing plan is required"],
    enum: {
      values: ['silver', 'golden', 'diamond', 'custom'],
      message: "Pricing plan must be one of: silver, golden, diamond, custom"
    }
  },
  customPricing: {
    silver: { type: String, default: "49,999" },
    golden: { type: String, default: "99,999" },
    diamond: { type: String, default: "1,49,999" }
  },
  
  // Feature Allocation
  features: [{
    featureName: { type: String, required: true },
    featuresCategories: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  }],

  // User Management
  noOfUsers: {
    type: String,
    required: [true, "Number of users is required"],
    enum: ['1-10', '10-20', '20-50', '50-100', '100+']
  },
  currentUserCount: {
    type: Number,
    default: 1 // Starts with admin user
  },

  // Database Configuration
  databaseName: {
    type: String,
    required: true,
    unique: true
  },
  databaseStatus: {
    type: String,
    enum: ['Pending', 'Initialized', 'Failed', 'Maintenance'],
    default: 'Pending'
  },
  databaseInitializedAt: {
    type: Date,
    default: null
  },
  databaseError: {
    type: String,
    default: null
  },

  // Status & Metadata
  status: {
    type: String,
    enum: ['Active', 'InActive', 'Suspended'],
    default: 'Active'
  },
  subscriptionStartDate: {
    type: Date,
    default: Date.now
  },
  subscriptionEndDate: {
    type: Date
  },

  // References
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    // required: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: "superadmin"
  }
});

companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate database name if not set
  if (!this.databaseName) {
    this.databaseName = `smt_${this.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
  }
  
  next();
});

// Index for better query performance
companySchema.index({ companyName: 1 });
companySchema.index({ adminEmail: 1 });
companySchema.index({ status: 1 });
companySchema.index({ pricingPlan: 1 });
companySchema.index({ databaseStatus: 1 });
companySchema.index({ createdAt: -1 });

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
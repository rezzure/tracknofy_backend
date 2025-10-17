
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const companyAdminSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Admin name is required"],
//     trim: true,
//     maxlength: [50, "Name cannot exceed 50 characters"]
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: [true, "Email already exists"],
//     lowercase: true,
//     trim: true,
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       "Please enter a valid email address"
//     ]
//   },
//   phone: {
//     type: String,
//     required: [true, "Phone number is required"],
//     trim: true,
//     // match: [/^[0-9]{10,15}$/, "Please enter a valid phone number (10-15 digits)"]
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: [6, "Password must be at least 6 characters"],
//     maxlength: [100, "Password cannot exceed 100 characters"]
//   },
//   role: {
//     type: String,
//     enum: {
//       values: ['SuperAdmin', 'Admin', 'Supervisor', 'Client'],
//       message: "Role must be one of: SuperAdmin, Admin, Supervisor, Client"
//     },
//     default: 'Admin'
//   },
//   companyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Company',
//     required: [true, "Company ID is required"]
//   },
//   companyGST: {
//     type: String,
//     // required: [true, "Company GST is required"],
//     trim: true,
//     uppercase: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   isFirstLogin: {
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

// companyAdminSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 12);
//   }
//   this.updatedAt = Date.now();
//   next();
// });

// companyAdminSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// const CompanyAdmin = mongoose.model('CompanyAdmin', companyAdminSchema);
// module.exports = CompanyAdmin;



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companyAdminSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    // required: [true, "Admin name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
    match: [/^[a-zA-Z\s]+$/, "Admin name should contain only letters and spaces"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address"
    ]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^\d{10,15}$/, "Please enter a valid phone number (10-15 digits)"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [100, "Password cannot exceed 100 characters"]
  },

  // Role & Permissions
  role: {
    type: String,
    enum: {
      values: ['SuperAdmin', 'Admin', 'Supervisor', 'Client', 'Project-Manager', 'Sales-Manager', 'Designer'],
      message: "Invalid role specified"
    },
    default: 'Admin'
  },
  permissions: [{
    type: String,
    required: true
  }],
  featureAccess: [{
    featureName: String,
    featurePath: String,
    accessLevel: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'write'
    }
  }],

  // Company Reference
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, "Company ID is required"]
  },
  companyName: {
    type: String,
    required: true
  },

  // Status & Security
  status: {
    type: String,
    enum: ['Active', 'InActive', 'Suspended'],
    default: 'Active'
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },

  // Profile Information
  profile: {
    department: String,
    designation: String,
    avatar: String
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
companyAdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.updatedAt = Date.now();
  next();
});

// Method to check if account is currently locked
companyAdminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Instance method for password comparison
companyAdminSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts');
  }
  
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  
  if (isMatch) {
    // Reset login attempts on successful login
    if (this.loginAttempts > 0) {
      this.loginAttempts = 0;
      this.lockUntil = null;
      await this.save();
    }
    return true;
  } else {
    // Increment login attempts
    this.loginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (this.loginAttempts >= 5) {
      this.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
    }
    
    await this.save();
    return false;
  }
};

// Method to record login
companyAdminSchema.methods.recordLogin = async function() {
  this.lastLogin = new Date();
  this.isFirstLogin = false;
  await this.save();
};

// // Indexes for better performance
// adminSchema.index({ email: 1 });
// adminSchema.index({ company: 1 });
// adminSchema.index({ role: 1 });
// adminSchema.index({ status: 1 });
// adminSchema.index({ createdAt: -1 });

const CompanyAdmin = mongoose.model('CompanyAdmin',companyAdminSchema);
module.exports = CompanyAdmin;
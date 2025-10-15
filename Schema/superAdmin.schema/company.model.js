// const mongoose = require('mongoose');

// const companySchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true
//   },
//   companyAddress: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   companyContactNo: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   companyLogo: {
//     type: String,
//     default: null
//   },
//   noOfUsers: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   status : {
//     type : String,
//     enum : ['Active', 'InActive'],
//     default : 'Active'
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

// module.exports=Company;



const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    unique: [true, "Company name already exists"],
    maxlength: [100, "Company name cannot exceed 100 characters"]
  },
  companyAddress: {
    type: String,
    required: [true, "Company address is required"],
    trim: true,
    maxlength: [500, "Company address cannot exceed 500 characters"]
  },
  companyContactNo: {
    type: String,
    required: [true, "Company contact number is required"],
    trim: true,
    match: [/^[0-9]{10,15}$/, "Please enter a valid contact number (10-15 digits)"]
  },
  companyGST: {
    type: String,
    // required: [true, "Company GST number is required"],
    trim: true,
    uppercase: true,
    unique: [true, "GST number already exists"],
    // match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, "Please enter a valid GST number"]
  },
  companyLogo: {
    type: String,
    default: null
  },
  noOfUsers: {
    type: Number,
    required: [true, "Number of users is required"],
    min: [1, "Number of users must be at least 1"],
    max: [1000, "Number of users cannot exceed 1000"]
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'InActive'],
      message: "Status must be either Active or InActive"
    },
    default: 'Active'
  },
  adminEmail: {
    type: String,
    required: [true, "Admin email is required"],
    trim: true,
    lowercase: true
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
module.exports = Company;
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const companyAdminSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     enum: ['SuperAdmin', 'Admin', 'Supervisor', 'Client'],
//     default: 'Admin'
//   },
//   companyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Company',
//     required: function() {
//       return this.role !== 'SuperAdmin';
//     }
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

// module.exports=CompanyAdmin;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companyAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Admin name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"]
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
    // match: [/^[0-9]{10,15}$/, "Please enter a valid phone number (10-15 digits)"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [100, "Password cannot exceed 100 characters"]
  },
  role: {
    type: String,
    enum: {
      values: ['SuperAdmin', 'Admin', 'Supervisor', 'Client'],
      message: "Role must be one of: SuperAdmin, Admin, Supervisor, Client"
    },
    default: 'Admin'
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, "Company ID is required"]
  },
  companyGST: {
    type: String,
    // required: [true, "Company GST is required"],
    trim: true,
    uppercase: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFirstLogin: {
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

companyAdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.updatedAt = Date.now();
  next();
});

companyAdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const CompanyAdmin = mongoose.model('CompanyAdmin', companyAdminSchema);
module.exports = CompanyAdmin;
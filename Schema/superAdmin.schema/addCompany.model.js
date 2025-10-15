// const { default: mongoose } = require("mongoose");

// const addCompanySchema = new mongoose.Schema({
//   companyName: {
//     type: String,
//     required: [true, "Company name is required"],
//   },
//   companyAddress: {
//     type: String,
//     required: [true, "Company address is required"],
//   },
//   companyContactNo: {
//     type: Number,
//     required: [true, "Company contact No is required"],
//   },
//   ContactPersonName: {
//     type: String,
//     required: [true, "Contact Person Name is required"],
//   },
//   contactNo: {
//     type: Number,
//     required: [true, "Contact Person Name is required"],
//   },
//   contactPersonEmail: {
//     type: String,
//     required: [true, "Contact person email is required"],
//     match: [
//       /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
//       "Please fill a valid email address",
//     ],
//   },
//   contactPersonPassword: {
//     type: String,
//     default: "admin@123",
//   },
//   noOfUser: {
//     type: Number,
//     required: [true, "No of user required"],
//     default: 0,
//   },
//   status: {
//     type: String,
//     enum: ["Active", "InActive"],
//     default: "Active",
//   },
//   companyLogo: {
//     type: String,
//     required: [true, "Company logo required"],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   createdBy: {
//     type: String,
//     default: "super admin",
//   },
// });

// const AddCompany = mongoose.model("AddCompany", addCompanySchema);

// module.exports = AddCompany;



const { default: mongoose } = require("mongoose");

const addCompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
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
    // match: [/^[0-9]{10,15}$/, "Please enter a valid contact number (10-15 digits)"]
  },
  companyGST: {
    type: String,
    // required: [true, "Company GST number is required"],
    trim: true,
    uppercase: true,
    // match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/, "Please enter a valid GST number"]
  },
  adminName: {
    type: String,
    required: [true, "Admin name is required"],
    trim: true,
    maxlength: [50, "Admin name cannot exceed 50 characters"]
  },
  adminContactNo: {
    type: String,
    required: [true, "Admin contact number is required"],
    trim: true,
    // match: [/^[0-9]{10,15}$/, "Please enter a valid contact number (10-15 digits)"]
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
  adminPassword: {
    type: String,
    required: [true, "Admin password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [100, "Password cannot exceed 100 characters"]
  },
  noOfUsers: {
    type: Number,
    required: [true, "Number of users is required"],
    min: [1, "Number of users must be at least 1"],
    max: [1000, "Number of users cannot exceed 1000"],
    default: 1
  },
  status: {
    type: String,
    enum: {
      values: ["Active", "InActive"],
      message: "Status must be either Active or InActive"
    },
    default: "Active"
  },
  companyLogo: {
    type: String,
    default: null
  },
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
    default: "super admin"
  }
});

addCompanySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AddCompany = mongoose.model("AddCompany", addCompanySchema);
module.exports = AddCompany;
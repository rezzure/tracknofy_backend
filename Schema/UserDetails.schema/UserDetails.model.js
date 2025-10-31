const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  reportingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: ""
  },
  reportingTo_name: {
    type: String,
    default: ""
  },
  employmentType: {
    type: String,
    default: ""
  },
  probationPeriod: {
    type: String,
    default: ""
  },
  dob: {
    type: Date,
    default: null
  },
  doj: {
    type: Date,
    default: null
  },
  contactNumber: {
    type: String,
    default: ""
  },
  aadharNumber: {
    type: String,
    default: ""
  },
  panNumber: {
    type: String,
    default: ""
  },
  bankName: {
    type: String,
    default: ""
  },
  accountNumber: {
    type: String,
    default: ""
  },
  ifscCode: {
    type: String,
    default: ""
  },
  // Separate profile photo field
  profilePhoto: {
    filename: {
      type: String,
      default: ''
    },
    originalName: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    mimetype: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 0
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  // Other images (multiple)
  images: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    mimetype: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 0
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: String,
    required: true,
    default: "admin"
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

userDetailsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
module.exports = UserDetails;
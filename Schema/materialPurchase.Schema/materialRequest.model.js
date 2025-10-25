
// const mongoose = require('mongoose');



// const materialItemSchema = new mongoose.Schema({
//   materialType: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   materialBrand: {
//     type: String,
//     default: ''
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   unit: {
//     type: String,
//     required: true,
//     enum: ['bags', 'kg', 'tons', 'liters', 'pieces', 'meter', 'feet', 'inches', 'cubicYards'],
//     default: 'bags'
//   },
//   remarks: {
//     type: String,
//     default: ''
//   }
// });

// const materialRequestSchema = new mongoose.Schema({
//   requestId: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   siteId: {
//     type: String,
//     required: true
//   },
//   siteName: {
//     type: String,
//     required: true
//   },
//   engineer: {
//     type: String,
//     required: true
//   },
//   engineerEmail: {
//     type: String,
//     required: true
//   },
//   materials: [materialItemSchema],
//   requiredBy: {
//     type: Date,
//     required: true
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'medium'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'assigned'],
//     default: 'pending'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   createdBy : {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
   
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// materialRequestSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const MaterialRequest = mongoose.model('MaterialRequest', materialRequestSchema);

// module.exports = MaterialRequest;


const { default: mongoose } = require("mongoose");



const materialItemSchema = new mongoose.Schema({
  materialType: {
    type: String,
    required: [true, 'Material type is required'],
    enum: ['civil', 'carpentry', 'plumbing', 'electrical', 'fabricator', 'others']
  },
  name: {
    type: String,
    required: [true, 'Material name is required'],
    trim: true
  },
  materialBrand: {
    type: String,
    default: '',
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: {
      values: ['bags', 'kg', 'tons', 'liters', 'pieces', 'meter', 'feet', 'inches', 'cubicYards'],
      message: '{VALUE} is not a valid unit'
    },
    default: 'bags'
  },
  remarks: {
    type: String,
    default: '',
    trim: true
  }
}, { _id: false }); // Add this to prevent automatic _id creation for subdocuments

const materialRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: [true, 'Request ID is required'],
    trim: true
  },
  siteId: {
    type: String,
    required: [true, 'Site ID is required'],
    trim: true
  },
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true
  },
  engineer: {
    type: String,
    required: [true, 'Engineer name is required'],
    trim: true
  },
  engineerEmail: {
    type: String,
    required: [true, 'Engineer email is required'],
    trim: true,
    lowercase: true
  },
  materials: {
    type: [materialItemSchema],
    required: [true, 'At least one material is required'],
    validate: {
      validator: function(materials) {
        return materials && materials.length > 0;
      },
      message: 'At least one material is required'
    }
  },
  requiredBy: {
    type: Date,
    required: [true, 'Required by date is required'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Required by date must be in the future'
    }
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'medium'
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'assigned'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make optional if not always available
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance

materialRequestSchema.index({ engineerEmail: 1 });
materialRequestSchema.index({ status: 1 });
materialRequestSchema.index({ createdAt: -1 });

// Pre-save middleware to generate requestId if not provided
materialRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate requestId if not provided
  if (!this.requestId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.requestId = `REQ-${timestamp}-${random}`.toUpperCase();
  }
  
  next();
});

// Static method to find by requestId or _id
materialRequestSchema.statics.findByRequestId = function(requestId) {
  return this.findOne({
    $or: [
      { requestId: requestId },
      { _id: requestId }
    ]
  });
};

const MaterialRequest = mongoose.model('MaterialRequest', materialRequestSchema);

module.exports = MaterialRequest;
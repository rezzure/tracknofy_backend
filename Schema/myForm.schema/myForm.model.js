// const mongoose = require('mongoose');

// const formResponseSchema = new mongoose.Schema({
//   formId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'Form'
//   },
//   formName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   formFields: [{
//     id: String,
//     label: String,
//     type: String,
//     required: Boolean,
//     options: [String],
//     measurementUnit: String,
//     allowUnitChange: Boolean,
//     measurementUnits: [String]
//   }],
//   formResponses: [{
//     type: mongoose.Schema.Types.Mixed,
//     required: true
//   }],
//   submittedBy: {
//     type: String,
//     required: true
//   },
//   submittedAt: {
//     type: Date,
//     default: Date.now
//   },
//   module: {
//     type: String,
//     required: true
//   },
//   updatedAt: {
//     type: Date
//   },
//   updatedBy: {
//     type: String
//   }
// }, {
//   timestamps: true
// });

// // Index for better query performance
// formResponseSchema.index({ submittedBy: 1 });
// formResponseSchema.index({ formId: 1 });
// formResponseSchema.index({ submittedAt: -1 });
// formResponseSchema.index({ formName: 'text', module: 'text' });

// module.exports = mongoose.model('MyForm', formResponseSchema);





// added version for the form

const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Form'
  },
  formName: {
    type: String,
    required: true,
    trim: true
  },
  formFields: [{
    id: String,
    label: String,
    type: String,
    required: Boolean,
    options: [String],
    measurementUnit: String,
    allowUnitChange: Boolean,
    measurementUnits: [String]
  }],
  formResponses: [{
    type: mongoose.Schema.Types.Mixed,
    required: true
  }],
  submittedBy: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  module: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date
  },
  updatedBy: {
    type: String
  },
  formVersion: {
    type: Number,
    default: 1,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
formResponseSchema.index({ submittedBy: 1 });
formResponseSchema.index({ formId: 1 });
formResponseSchema.index({ submittedAt: -1 });
formResponseSchema.index({ formName: 'text', module: 'text' });
formResponseSchema.index({ formId: 1, formVersion: -1 });

module.exports = mongoose.model('MyForm', formResponseSchema);
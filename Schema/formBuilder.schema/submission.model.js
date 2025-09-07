const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true
  },
  value: mongoose.Schema.Types.Mixed // Can be string, boolean, array, etc.
});

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  formName: {
    type: String,
    required: true
  },
  data: [formDataSchema],
  submittedBy: {
    type: String,
    default: 'Anonymous'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

submissionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission
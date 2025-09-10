const mongoose = require('mongoose');

const FormSubmissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  formName: {
    type: String,
    required: true
  },
  submissionData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  submittedBy: {
    type: String,
    default: 'anonymous'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

const FormSubmission = mongoose.model('FormSubmission', FormSubmissionSchema);

module.exports =FormSubmission
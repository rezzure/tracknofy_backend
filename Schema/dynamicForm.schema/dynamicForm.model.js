const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  formName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  formFields: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date', 'image']
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{
      type: String,
      trim: true
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  }
}, {
  timestamps: true
});

const Form = mongoose.model('Form', FormSchema);
module.exports = Form
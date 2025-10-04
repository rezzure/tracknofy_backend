const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  }
});

const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date', 'image',"canvas"]
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [optionSchema]
});

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  fields: [fieldSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

formSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

 const Form = mongoose.model('Form', formSchema);

 module.exports = Form
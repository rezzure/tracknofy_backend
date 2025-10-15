// const mongoose = require('mongoose');

// const FormSchema = new mongoose.Schema({
//   userEmail: [{
//     type: String,
//     trim: true,
//     lowercase: true,
//     validate: {
//       validator: function(email) {
//         // Basic email validation
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//       },
//       message: 'Please provide a valid email address'
//     }
//   }],
//   formName: {
//     type: String,
//     required: true,
//     trim: true,
//     maxLength: 200
//   },
//   formFields: [{
//     id: {
//       type: String,
//       required: true
//     },
//     type: {
//       type: String,
//       required: true,
//       enum: ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date', 'image',"canvas","measurement"]
//     },
//     label: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     required: {
//       type: Boolean,
//       default: false
//     },
//     options: [{
//       type: String,
//       trim: true
//     }]
//   }],
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdBy: {
//     type: String,
//     default: 'anonymous'
//   }
// }, {
//   timestamps: true
// });

// const Form = mongoose.model('Form', FormSchema);
// module.exports = Form;




// 15/10 first code for my form

const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  userEmail: [{
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  }],
  myForm: [{
    moduleName: {
      type: String,
      required: true,
      enum: ['My Form'],
      default: 'My Form'
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email address'
      }
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
      enum: ['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date', 'image',"canvas","measurement"]
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
module.exports = Form;

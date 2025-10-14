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




// updates for my form

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
  // NEW: User Forms for module assignment
  userForms: [{
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
    moduleName: {
      type: String,
      required: true,
      enum: ['Survey Form', 'My Forms'],
      default: 'Survey Form'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active'
    }
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
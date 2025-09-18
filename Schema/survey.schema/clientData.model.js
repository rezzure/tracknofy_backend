// const mongoose = require('mongoose');

// const clientDataSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   mobile: {
//     type: String,
//     required: true
//   },
//   address: {
//     type: String,
//     default: ''
//   },
//   siteShortName: {
//     type: String,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// const ClientData = mongoose.model('ClientData', clientDataSchema);
// module.exports = ClientData














const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  clientMobile: {
    type: String,
    required: true,
    trim: true
  },
  siteAddress: {
    type: String,
    trim: true
  },
  siteShortName: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    // required: true,
    trim: true
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

// Update the updatedAt field before saving
clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ClientData = mongoose.model('ClientData', clientSchema);

module.exports = ClientData
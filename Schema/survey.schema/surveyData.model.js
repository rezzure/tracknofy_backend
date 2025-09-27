// const mongoose = require('mongoose');

// const surveySchema = new mongoose.Schema({
//   clientId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ClientData',
//     required: true
//   },
//   clientData: {
//     name: String,
//     email: String,
//     mobile: String,
//     address: String,
//     siteShortName: String
//   },
//   surveyData: {
//     type: mongoose.Schema.Types.Mixed, // This will store all the floor/room data
//     default: {}
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// surveySchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const Survey = mongoose.model('Survey', surveySchema);

// module.exports = Survey;



















const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientData',
    required: true
  },
  clientData: {
    name: String,
    email: String,
    mobile: String,
    address: String,
    siteShortName: String
  },
  surveyData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  workItems: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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

surveySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
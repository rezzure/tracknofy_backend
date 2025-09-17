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
    type: Object,
    required: true
  },
  status: {
    type: String,
    default: 'completed'
  }
}, {
  timestamps: true
});

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey
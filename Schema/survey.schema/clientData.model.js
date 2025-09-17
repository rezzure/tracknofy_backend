const mongoose = require('mongoose');

const clientDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  siteShortName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const ClientData = mongoose.model('ClientData', clientDataSchema);
module.exports = ClientData
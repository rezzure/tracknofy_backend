const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  partnerType: {
    type: String,
    required: true
  },
  partnerName: {
    type: String,
    required: true
  },
  partnerMobile: {
    type: Number,
    required: true
  },
  partnerAddress: {
    type: String,
    required: true
  },
  partnerPhoto: {
    type: String, // Store file path
    required: false
  },
  partnerIdProof: {
    type: String, // Store file path
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'createdByModel', // Points to field that specifies which model
    required: true
  },
  createdByModel: {
    type: String,
    enum: ['Admin', 'Supervisor'], // Allowed model names
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},

{
  timestamps: true
});

const PartnerManagement = mongoose.model("PartnerManagement", partnerSchema);

module.exports = PartnerManagement;

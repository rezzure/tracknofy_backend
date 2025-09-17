const mongoose = require("mongoose");

const dailyPartnerSchema = new mongoose.Schema({
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
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'createdByModel',
    required: true
  },
  createdByModel: {
    type: String,
    enum: ['Admin', 'Supervisor'],
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
dailyPartnerSchema.index({ createdAt: -1 });
dailyPartnerSchema.index({ createdBy: 1 });
dailyPartnerSchema.index({ partnerType: 1 });

const DailyPartnerDetails = mongoose.model("DailyPartnerDetails", dailyPartnerSchema);

module.exports = DailyPartnerDetails;
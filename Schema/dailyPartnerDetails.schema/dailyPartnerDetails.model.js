// dailyPartnerDetails.model.js
const mongoose = require("mongoose");

const dailyPartnerSchema = new mongoose.Schema(
  {
    partnerType: { type: String, required: true },
    partnerName: { type: String, required: true },
    partnerMobile: { type: Number, required: true },
    partnerAddress: { type: String, required: true },
    partnerPhoto: { type: String, required: false },
    partnerIdProof: { type: String, required: false },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    },
    createdByModel: {
      type: String,
      enum: ["Admin", "Supervisor"],
      required: true,
    },
    checkInDate: {
      type: String, // YYYY-MM-DD format
      required: true,
      default: () => new Date().toISOString().split("T")[0],
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
dailyPartnerSchema.index({ checkInDate: -1 });
dailyPartnerSchema.index({ createdBy: 1 });
dailyPartnerSchema.index({ partnerType: 1 });

const DailyPartnerDetails = mongoose.model(
  "DailyPartnerDetails",
  dailyPartnerSchema
);
module.exports = DailyPartnerDetails;

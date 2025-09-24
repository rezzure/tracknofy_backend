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
    // **FIX**: Removed default value. Now required from the API call.
    checkInDate: {
      type: String, // YYYY-MM-DD format
      required: true,
    },
    // **FIX**: Removed default value. Now required from the API call.
    checkInTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

dailyPartnerSchema.index({ checkInDate: -1 });
dailyPartnerSchema.index({ createdBy: 1 });
dailyPartnerSchema.index({ partnerType: 1 });

const DailyPartnerDetails = mongoose.model(
  "DailyPartnerDetails",
  dailyPartnerSchema
);
module.exports = DailyPartnerDetails;
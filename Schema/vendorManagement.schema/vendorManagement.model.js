const mongoose = require("mongoose");
const vendorManagementSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
    },
    vendorCompany: {
      type: String,
      required: true,
    },
    vendorAddress: {
      type: String,
      required: true,
    },
    vendorMobile: {
      type: Number,
      required: true,
    },
    vendorEmail: {
      type: String,
      required: true,
      unique: true,
    },
    remarks: {
      type: String,
      default: "No remarks",
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const VendorManagement = mongoose.model(
  "VendorManagement",
  vendorManagementSchema
);

module.exports = VendorManagement;

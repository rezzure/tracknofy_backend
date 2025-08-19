const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  fieldname: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  destination: { type: String, required: true }, // Changed from Number to String
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true }, // Changed from String to Number
  uploadedAt: { type: Date, default: Date.now },
});

const progressReportSchema = new mongoose.Schema(
  {
    siteName: { 
      type: String, 
      required: true 
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    supervisor: {
       type: String, 
       required: true 
      },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Added reference
    reportDate: { 
      type: Date,
       required: true 
      }, // Changed from 'date' to 'reportDate'
    description: {
       type: String, 
       required: true 
      },
    photos: [photoSchema],
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rejected"],
      default: "submitted", // Changed default to match your workflow
    },
    // ... rest of your schema
  },
  { timestamps: true }
);


const Progress = mongoose.model("Progress", progressReportSchema);
module.exports = Progress;


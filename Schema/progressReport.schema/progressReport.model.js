const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  resolvedMessage: { type: String }
});

const photoSchema = new mongoose.Schema({
  fieldname: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  destination: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
  caption: { type: String, default: "Site photo" },
  comments: [commentSchema],
  drawingData: { type: String } // Store drawing as base64 data URL
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
    },
    reportDate: { 
      type: Date,
      required: true 
    },
    description: {
      type: String, 
      required: true 
    },
    photos: [photoSchema],
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected", "needs_revision"],
      default: "submitted",
    },
    adminFeedback: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressReportSchema);
module.exports = Progress;

// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   text: { type: String, required: true },
//   author: { type: String, required: true },
//   date: { type: Date, required: true },
//   position: {
//     x: { type: Number, required: true },
//     y: { type: Number, required: true }
//   },
//   resolved: { type: Boolean, default: false },
//   resolvedAt: { type: Date },
//   resolvedMessage: { type: String }
// });

// const photoSchema = new mongoose.Schema({
//   fieldname: { type: String, required: true },
//   originalname: { type: String, required: true },
//   mimetype: { type: String, required: true },
//   destination: { type: String, required: true },
//   filename: { type: String, required: true },
//   path: { type: String, required: true },
//   size: { type: Number, required: true },
//   uploadedAt: { type: Date, default: Date.now },
//   caption: { type: String, default: "Site photo" },
//   comments: [commentSchema],
//   drawingData: { type: String } // Store drawing as base64 data URL
// });

// const progressReportSchema = new mongoose.Schema(
//   {
//     siteName: { 
//       type: String, 
//       required: true 
//     },
//     site: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Site",
//       required: true,
//     },
//     supervisor: {
//       type: String, 
//       required: true 
//     },
//     supervisorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     reportDate: { 
//       type: Date,
//       required: true 
//     },
//     description: {
//       type: String, 
//       required: true 
//     },
//     photos: [photoSchema],
//     status: {
//       type: String,
//       enum: ["draft", "submitted", "under_review", "approved", "rejected", "needs_revision"],
//       default: "submitted",
//     },
//     adminFeedback: {
//       type: String,
//       default: ""
//     }
//   },
//   { timestamps: true }
// );

// const Progress = mongoose.model("Progress", progressReportSchema);
// module.exports = Progress;


const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true }, // "Admin" or "Supervisor"
  date: { type: Date, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  resolved: { type: Boolean, default: false },
  resolvedAt: { type: Date },
  resolvedBy: { type: String }, // Supervisor's name
  resolvedMessage: { type: String },
  // Communication thread
  replies: [{
    text: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ["resolution", "followup", "clarification"], default: "resolution" }
  }],
  statusHistory: [{
    status: { type: String, enum: ["open", "in_progress", "resolved", "reopened"] },
    changedBy: { type: String },
    date: { type: Date, default: Date.now },
    note: { type: String }
  }]
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
  drawingData: { type: String }
});

const progressReportSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    supervisor: { type: String, required: true },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportDate: { type: Date, required: true },
    description: { type: String, required: true },
    photos: [photoSchema],
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected", "needs_revision", "resolved"],
      default: "submitted",
    },
    adminFeedback: { type: String, default: "" },
    // Track overall resolution status
    unresolvedCommentsCount: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Method to count unresolved comments
progressReportSchema.methods.updateUnresolvedCount = function() {
  let unresolvedCount = 0;
  this.photos.forEach(photo => {
    photo.comments.forEach(comment => {
      if (!comment.resolved) unresolvedCount++;
    });
  });
  this.unresolvedCommentsCount = unresolvedCount;
  this.lastActivity = new Date();
  
  // Update overall report status based on comments
  if (unresolvedCount === 0 && this.photos.some(photo => photo.comments.length > 0)) {
    this.status = "resolved";
  } else if (unresolvedCount > 0) {
    this.status = "needs_revision";
  }
};

const Progress = mongoose.model("Progress", progressReportSchema);
module.exports = Progress;
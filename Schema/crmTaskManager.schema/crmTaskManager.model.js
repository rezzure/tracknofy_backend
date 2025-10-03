const mongoose = require("mongoose");

const crmTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["todo", "inprogress", "done"],
      default: "todo",
    },

    startDate: { type: Date },
    dueDate: { type: Date },

    tags: [{ type: String }],

    // User references
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignorName: { type: String, required: true },
    assignorEmail: { type: String, required: true },
    assigneeName: { type: String, required: true },
    assigneeEmail: { type: String, required: true },

    siteId: { type: String }, // optional if needed

  },
  { timestamps: true }
);

const CRMTask = mongoose.model("CRMTask", crmTaskSchema);

module.exports = CRMTask

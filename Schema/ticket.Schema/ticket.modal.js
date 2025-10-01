const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  // Reference to the original query
  queryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Query",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // Assignment information
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedToName: {
    type: String,
    required: true,
    trim: true
  },
  assignedRole: {
    type: String,
    required: true,
    trim: true
  },
  assignedBy: {
    type: String,
    // required: true,
    trim: true
  },
  assignedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  },
  // Ticket details
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  dueDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["assigned", "in-progress", "resolved", "closed"],
    default: "assigned"
  },
  // Resolution information
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resolvedByName: {
    type: String,
    trim: true
  },
  resolutionNotes: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  // Communication thread for ticket-specific discussions
  communications: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      senderName: {
        type: String,
        required: true,
        trim: true
      },
      senderRole: {
        type: String,
        required: true,
        trim: true
      },
      message: {
        type: String,
        required: true
      },
      attachments: [
        {
          type: String
        }
      ],
      sentAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  closedAt: {
    type: Date
  }
});

// Middleware to update the updatedAt field
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set resolvedAt when status changes to resolved
  if (this.status === "resolved" && this.isModified('status')) {
    this.resolvedAt = new Date();
  }
  
  // Set closedAt when status changes to closed
  if (this.status === "closed" && this.isModified('status')) {
    this.closedAt = new Date();
  }
  
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
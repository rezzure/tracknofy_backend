const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  lastContact: {
    type: Date,
    default: Date.now
  },
  nextContact: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: ''
  },
  mobile: {
    type: String,
    required: true,
  },
  spocName: {
    type: String,
    default: ''
  },
  spocMobile: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  leadSource: {
    type: String,
    default: ''
  },
  assign: {
    type: String,
    default: ''
  },
  projectType: {
    type: String,
    default: ''
  },
  // --- ADDED FIELD ---
  projectCategory: {
    type: String,
    // Ensures only these values (or an empty string) can be saved
    enum: ['interior', 'exterior', 'construction', 'architecture', 'renovation', ''],
    default: ''
  },
  // --------------------
  leadType: {
    type: String,
    enum: ['hot lead', 'warm lead', 'cold lead', ''],
    default: ''
  },
  leadStatus: {
    type: String,
    enum: ['new leads', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed won', 'lost'],
    default: 'new leads'
  },
  description: {
    type: String,
    default: ''
  },
  tentativeValue: {
    type: Number,
    default: 0
  },
  lost: {
    type: String,
    default: ''
  },
  conversations: [conversationSchema],
  lastContact: {
    type: Date,
    default: Date.now
  },
  nextContact: {
    type: Date
  }
}, { timestamps: true });

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
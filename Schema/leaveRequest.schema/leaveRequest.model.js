const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leave_type: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    enum: ['full-day', 'half-day', 'multiple-days'],
    required: true
  },
  reason: {
    type: String,
    default: '' // Made optional with default empty string
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approved_at: {
    type: Date,
    default: null
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
leaveRequestSchema.index({ user_id: 1, start_date: 1 });
leaveRequestSchema.index({ status: 1 });
leaveRequestSchema.index({ created_at: -1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
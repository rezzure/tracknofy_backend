const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  user_mobile: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  marked_by: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  marked_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one attendance record per user per day
attendanceSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
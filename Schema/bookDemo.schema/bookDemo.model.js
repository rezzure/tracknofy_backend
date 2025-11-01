const mongoose = require('mongoose');

const demoBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters']
    },
    employees: {
      type: String,
      required: [true, 'Number of employees is required'],
      enum: ['1-5', '5-10', '10-25', '25-50', '50-100', '100+']
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    demoDate: {
      type: Date,
      required: [true, 'Demo date is required']
    },
    demoTime: {
      type: String,
      required: [true, 'Demo time is required']
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries
demoBookingSchema.index({ email: 1 });
demoBookingSchema.index({ demoDate: 1 });
demoBookingSchema.index({ status: 1 });
demoBookingSchema.index({ createdAt: -1 });

// Virtual for full date-time
demoBookingSchema.virtual('fullDateTime').get(function() {
  return `${this.demoDate.toLocaleDateString()} at ${this.demoTime}`;
});

module.exports = mongoose.model('DemoBooking', demoBookingSchema);
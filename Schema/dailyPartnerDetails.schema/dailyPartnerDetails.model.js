const mongoose = require("mongoose");

// Set timezone to IST for the entire application
process.env.TZ = 'Asia/Kolkata';

const dailyPartnerSchema = new mongoose.Schema({
  partnerType: {
    type: String,
    required: true
  },
  partnerName: {
    type: String,
    required: true
  },
  partnerMobile: {
    type: Number,
    required: true
  },
  partnerAddress: {
    type: String,
    required: true
  },
  partnerPhoto: {
    type: String, // Store file path
    required: false
  },
  partnerIdProof: {
    type: String, // Store file path
    required: false
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'createdByModel',
    required: true
  },
  createdByModel: {
    type: String,
    enum: ['Admin', 'Supervisor'],
    required: true
  },
  // Custom IST timestamps
  createdAt: {
    type: Date,
    default: () => {
      const now = new Date();
      // Convert to IST (UTC + 5:30)
      const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      return new Date(now.getTime() + istOffset);
    }
  },
  updatedAt: {
    type: Date,
    default: () => {
      const now = new Date();
      // Convert to IST (UTC + 5:30)
      const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      return new Date(now.getTime() + istOffset);
    }
  }
}, {
  // Don't use automatic timestamps since we're handling them manually
  timestamps: false
});

// Pre-save middleware to update the updatedAt field on document updates
dailyPartnerSchema.pre('save', function(next) {
  if (!this.isNew) {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    this.updatedAt = new Date(now.getTime() + istOffset);
  }
  next();
});

// Pre-update middleware for findOneAndUpdate operations
dailyPartnerSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  this.set({ updatedAt: new Date(now.getTime() + istOffset) });
  next();
});

// Index for better query performance
dailyPartnerSchema.index({ createdAt: -1 });
dailyPartnerSchema.index({ createdBy: 1 });
dailyPartnerSchema.index({ partnerType: 1 });

// Helper method to get IST formatted date string
dailyPartnerSchema.methods.getFormattedCreatedAt = function() {
  return this.createdAt.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Static method to create IST date
dailyPartnerSchema.statics.createISTDate = function() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  return new Date(now.getTime() + istOffset);
};

const DailyPartnerDetails = mongoose.model("DailyPartnerDetails", dailyPartnerSchema);

module.exports = DailyPartnerDetails;
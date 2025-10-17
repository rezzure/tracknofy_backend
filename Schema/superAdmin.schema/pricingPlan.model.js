const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: [true, "Plan name is required"],
    enum: ['silver', 'golden', 'diamond'],
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  features: [{
    featureName: String,
    featuresCategories: String,
    path: String,
    icon: String,
    included: {
      type: Boolean,
      default: true
    }
  }],
  maxUsers: {
    type: String,
    required: true,
    enum: ['1-10', '10-20', '20-50', '50-100', '100+']
  },
  supportLevel: {
    type: String,
    enum: ['basic', 'priority', 'premium'],
    default: 'basic'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pricingPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);
module.exports = PricingPlan;
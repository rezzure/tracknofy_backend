const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: [true, "Feature name is required"],
    unique: true,
    trim: true
  },
  featuresCategories: {
    type: String,
    required: [true, "Feature category is required"],
    enum: ['Finances', 'Sites', 'Resources', 'Others', 'Designer', 'Calculator', 'Quotations', 'Material', 'DMS']
  },
  path: {
    type: String,
    // required: [true, "Feature path is required"],
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    required: [true, "Feature icon is required"]
  },
  description: {
    type: String,
    required: true
  },
  requiredPermissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'admin']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  dependsOn: [{
    type: String // Other feature paths that this feature depends on
  }],
  collectionName: {
    type: String,
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

featureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Feature = mongoose.model('Feature', featureSchema);
module.exports = Feature;
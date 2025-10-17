const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  assignee: {
    type: String,
    default: '',
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'inprogress', 'review', 'done'],
    default: 'todo' // Changed default to 'todo' as per requirement
  },
  // Site Information
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    // required: true,
    index: true
  },
  siteName: {
    type: String,
    trim: true,
    // required: true
  },
  // Assignor Information
  assignorName: {
    type: String,
    trim: true,
    default: ''
  },
  assignorEmail: {
    type: String,
    trim: true,
    default: ''
  },
  // Assignee Information
  assigneeName: {
    type: String,
    trim: true,
    default: ''
  },
  assigneeEmail: {
    type: String,
    trim: true,
    default: ''
  },
  // NEW FIELDS: Quotation and Work Information
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ManualQuotation',
    // required: true,
    index: true
  },
  workTypeId: {
    type: String,
    // required: true
  },
  workType: {
    type: String,
    // required: true
  },
  workCategory: {
    type: String,
    default: ''
  },
  projectType: {
    type: String,
    default: ''
  },
  scopeOfWork: {
    type: String,
    default: ''
  },
  floor: {
    type: String,
    default: ''
  },
  roomNumber: {
    type: String,
    default: ''
  },
  materials: {
    type: String,
    default: ''
  },
  // Task source information
  sourceType: {
    type: String,
    enum: ['quotation', 'manual'],
    default: 'quotation'
  },
  originalTaskId: {
    type: String // To track the original task ID from quotation
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  // Add this field to your Task schema
completionPercentage: {
  type: Number,
  default: 0,
  min: 0,
  max: 100
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

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add compound indexes for better query performance
taskSchema.index({ siteId: 1, status: 1 });
taskSchema.index({ siteId: 1, createdAt: -1 });
taskSchema.index({ quotationId: 1, siteId: 1 });
taskSchema.index({ workTypeId: 1 });

// Static method to get tasks by site
taskSchema.statics.getTasksBySite = function(siteId, filters = {}) {
  return this.find({ siteId, ...filters }).sort({ createdAt: -1 });
};

// Static method to get tasks by quotation
taskSchema.statics.getTasksByQuotation = function(quotationId) {
  return this.find({ quotationId }).sort({ createdAt: -1 });
};

// Static method to get task statistics by site
taskSchema.statics.getStatsBySite = function(siteId) {
  return this.aggregate([
    { $match: { siteId: new mongoose.Types.ObjectId(siteId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Instance method to validate site ownership (optional)
taskSchema.methods.validateSiteAccess = function(userSiteIds = []) {
  return userSiteIds.includes(this.siteId.toString());
};

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
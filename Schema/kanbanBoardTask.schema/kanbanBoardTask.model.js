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
    default: 'todo'
  },
  // Site Information
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    index: true
  },
  siteName: {
    type: String,
    trim: true
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
    index: true
  },
  workTypeId: {
    type: String
  },
  workType: {
    type: String
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
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  // Completion percentage
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // NEW: Blocker fields
  blocker: {
    type: String,
    default: '',
    trim: true
  },
  blockerDescription: {
    type: String,
    default: '',
    trim: true
  },
  blockerAddedAt: {
    type: Date
  },
  blockerResolvedAt: {
    type: Date
  },
  isBlocked: {
    type: Boolean,
    default: false
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
  
  // Automatically set isBlocked based on blocker field
  if (this.blocker && this.blocker.trim() !== '') {
    this.isBlocked = true;
    if (!this.blockerAddedAt) {
      this.blockerAddedAt = new Date();
    }
  } else {
    this.isBlocked = false;
    this.blockerResolvedAt = new Date();
  }
  
  next();
});

// Add compound indexes for better query performance
taskSchema.index({ siteId: 1, status: 1 });
taskSchema.index({ siteId: 1, createdAt: -1 });
taskSchema.index({ quotationId: 1, siteId: 1 });
taskSchema.index({ workTypeId: 1 });
taskSchema.index({ isBlocked: 1 }); // New index for blocker queries

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

// Static method to get blocked tasks by site
taskSchema.statics.getBlockedTasksBySite = function(siteId) {
  return this.find({ 
    siteId: new mongoose.Types.ObjectId(siteId),
    isBlocked: true 
  }).sort({ blockerAddedAt: -1 });
};

// Instance method to validate site ownership (optional)
taskSchema.methods.validateSiteAccess = function(userSiteIds = []) {
  return userSiteIds.includes(this.siteId.toString());
};

// Instance method to add blocker
taskSchema.methods.addBlocker = function(blocker, blockerDescription) {
  this.blocker = blocker;
  this.blockerDescription = blockerDescription;
  this.isBlocked = true;
  this.blockerAddedAt = new Date();
  return this.save();
};

// Instance method to resolve blocker
taskSchema.methods.resolveBlocker = function() {
  this.blocker = '';
  this.blockerDescription = '';
  this.isBlocked = false;
  this.blockerResolvedAt = new Date();
  return this.save();
};

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
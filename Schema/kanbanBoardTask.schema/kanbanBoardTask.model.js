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
    default: 'backlog'
  },
  // NEW FIELD: Site ID to link tasks to specific sites
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site', // Reference to your Site model (adjust the model name as needed)
    required: true,
    index: true // Add index for better query performance
  },
  // Optional: Add user ID if you want to track who created the task
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model (adjust the model name as needed)
    index: true
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

// Add compound index for better query performance
taskSchema.index({ siteId: 1, status: 1 });
taskSchema.index({ siteId: 1, createdAt: -1 });

// Static method to get tasks by site
taskSchema.statics.getTasksBySite = function(siteId, filters = {}) {
  return this.find({ siteId, ...filters }).sort({ createdAt: -1 });
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
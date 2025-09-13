const mongoose = require('mongoose');

const taskMovementSchema = new mongoose.Schema({
  // Reference to the task that was moved
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  
  // Task title at the time of movement
  taskTitle: {
    type: String,
    required: true,
    trim: true
  },
  
  // Previous status/column
  fromStatus: {
    type: String,
    required: true,
    enum: ['backlog', 'todo', 'inprogress', 'review', 'done', 'none']
  },
  
  // New status/column
  toStatus: {
    type: String,
    required: true,
    enum: ['backlog', 'todo', 'inprogress', 'review', 'done']
  },
  
  // User who performed the movement
  movedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User's name for easy display
  movedByName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Reference to the site/project
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  },
  
  // When the movement occurred
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  // Automatically add createdAt and updatedAt fields
  timestamps: true
});

// Create indexes for better performance
taskMovementSchema.index({ taskId: 1, timestamp: -1 });
taskMovementSchema.index({ siteId: 1, timestamp: -1 });

// Create model
const TaskMovement = mongoose.model('TaskMovement', taskMovementSchema);

module.exports = TaskMovement;
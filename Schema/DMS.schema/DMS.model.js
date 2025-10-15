const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['folder', 'file'],
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  },
  filePath: {
    type: String,
  },
  size: {
    type: Number, 
  },
  assignTo: [{
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    allowedOperations: [{
      type: String,
      enum: ['read', 'write', 'delete', 'upload', 'create', 'download']
    }],
    description: {
      type: String,
      default: ''
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    assignedBy: {
      type: String, 
    }
  }],
  createdBy: {
    type: String,
  },
  createrName: {
    type: String
  },
  updatedBy: {
    type: String,
  },
  updaterName: {
    type: String
  }
}, { timestamps: true });

ItemSchema.index({ 'assignTo.userEmail': 1 });
ItemSchema.index({ parent: 1 });

module.exports = mongoose.model('Item', ItemSchema);
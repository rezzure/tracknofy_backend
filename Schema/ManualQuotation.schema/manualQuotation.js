const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  workTypeId: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  workType: {
    type: String,
    required: true
  },
});

const workCategorySchema = new mongoose.Schema({
  id: {
    type: String,
  },
  categoryNumber: {
    type: Number,
  },
  workCategory: {
    type: String,
  },
  workType: {
    type: String,
  },
  tasks: [taskSchema],
  materials: {
    type: String,
  },
  length: {
    type: String,
    default: ""
  },
  width: {
    type: String,
    default: ""
  },
  height: {
    type: String,
    default: ""
  },
  unit: {
    type: String,
    default: "sqm"
  },
  quantity: {
    type: String,
  },
  rate: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  remarks: {
    type: String,
    default: ""
  }
});

const workItemSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  serialNo: {
    type: Number,
  },
  floor: {
    type: String,
  },
  roomNumber: {
    type: String,
  },
  projectType: {
    type: String,
  },
  scopeOfWork: {
    type: String,
  },
  workCategories: [workCategorySchema]
});

const clientDataSchema = new mongoose.Schema({
  siteName: {
    type: String,
  },
  clientName: {
    type: String,
  },
  clientEmail: {
    type: String,
    default: ""
  },
  clientPhone: {
    type: String,
    default: ""
  },
  siteAddress: {
    type: String,
    default: ""
  },
  quotationDate: {
    type: String,
  },
  validityPeriod: {
    type: Number,
    default: 30
  },
  notes: {
    type: String,
    default: ""
  }
});

const assignedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const approvedBySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ""
  },
  approvedAt: {
    type: Date,
    default: Date.now
  }
});

const archivedBySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ""
  },
  archivedAt: {
    type: Date,
    default: Date.now
  }
});

// NEW: Site Creation Tracking Schema
const siteCreationSchema = new mongoose.Schema({
  isSiteCreated: {
    type: Boolean,
    default: false
  },
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    default: null
  },
  siteName: {
    type: String,
    default: ""
  },
  clientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  clientEmail: {
    type: String,
    default: ""
  },
  createdBy: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: null
  }
});

const versionHistorySchema = new mongoose.Schema({
  versionNumber: {
    type: Number,
    required: true
  },
  quotationId: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  changes: {
    type: String,
    default: ""
  },
  createdBy: {
    type: String
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Approved', 'Rejected', 'Revised'],
    default: 'Draft'
  },
  totalAmount: {
    type: Number,
  },
  clientRemarks: {
    type: String,
    default: ""
  },
  workItemComments: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  approvedBy: approvedBySchema
});

const manualQuotationSchema = new mongoose.Schema({
  quotationId: {
    type: String,
    unique: true
  },
  siteName: {
    type: String,
  },
  clientName: {
    type: String,
  },
  generatedDate: {
    type: Date,
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Approved', 'Rejected', 'Revised'],
    default: 'Draft'
  },
  sections: {
    type: Number,
  },
  type: {
    type: String,
    enum: ['manual', 'survey'],
    default: 'manual'
  },
  clientData: clientDataSchema,
  workItems: [workItemSchema],
  createdBy: {
    type: String
  },
  clientRemarks: {
    type: String,
    default: ""
  },
  workItemComments: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  assignedTo: assignedUserSchema,
  approvedBy: approvedBySchema,
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedBy: archivedBySchema,
  archiveReason: {
    type: String,
    default: ""
  },
  // NEW: Site Creation Tracking
  siteCreation: {
    type: siteCreationSchema,
    default: {
      isSiteCreated: false,
      siteId: null,
      siteName: "",
      clientUserId: null,
      clientEmail: "",
      createdBy: "",
      createdAt: null
    }
  },
  versionNumber: {
    type: Number,
    default: 1
  },
  isLatestVersion: {
    type: Boolean,
    default: true
  },
  parentQuotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ManualQuotation'
  },
  versionHistory: [versionHistorySchema],
  revisionReason: {
    type: String,
    default: ""
  },
  autoSendToClient: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

manualQuotationSchema.index({ quotationId: 1 });
manualQuotationSchema.index({ createdBy: 1 });
manualQuotationSchema.index({ status: 1 });
manualQuotationSchema.index({ 'assignedTo.userId': 1 });
manualQuotationSchema.index({ parentQuotationId: 1 });
manualQuotationSchema.index({ isLatestVersion: 1 });
manualQuotationSchema.index({ isArchived: 1 });
manualQuotationSchema.index({ 'siteCreation.isSiteCreated': 1 }); // NEW: Index for site creation queries

module.exports = mongoose.model('ManualQuotation', manualQuotationSchema);
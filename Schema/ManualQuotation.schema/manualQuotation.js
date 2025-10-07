const mongoose = require('mongoose');

const workCategorySchema = new mongoose.Schema({
  id: {
    type: String,
    // required: true
  },
  categoryNumber: {
    type: Number,
    // required: true
  },
  workCategory: {
    type: String,
    // required: true
  },
  workType: {
    type: String,
    // required: true
  },
  task: {
    type: String,
    default: ""
  },
  materials: {
    type: String,
    // required: true
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
    // required: true
  },
  rate: {
    type: String,
    // required: true
  },
  totalAmount: {
    type: Number,
    // required: true
  },
  remarks: {
    type: String,
    default: ""
  }
});

const workItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    // required: true
  },
  serialNo: {
    type: Number,
    // required: true
  },
  floor: {
    type: String,
    // required: true
  },
  roomNumber: {
    type: String,
    // required: true
  },
  projectType: {
    type: String,
    // required: true
  },
  scopeOfWork: {
    type: String,
    // required: true
  },
  workCategories: [workCategorySchema]
});

const clientDataSchema = new mongoose.Schema({
  siteName: {
    type: String,
    // required: true
  },
  clientName: {
    type: String,
    // required: true
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
    // required: true
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

const manualQuotationSchema = new mongoose.Schema({
  quotationId: {
    type: String,
    // required: true,
    unique: true
  },
  siteName: {
    type: String,
    // required: true
  },
  clientName: {
    type: String,
    // required: true
  },
  generatedDate: {
    type: Date,
    // required: true
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    // required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  sections: {
    type: Number,
    // required: true
  },
  type: {
    type: String,
    enum: ['manual', 'survey'],
    default: 'manual'
  },
  clientData: clientDataSchema,
  workItems: [workItemSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  }
}, {
  timestamps: true
});

// Create index for better query performance
manualQuotationSchema.index({ quotationId: 1 });
manualQuotationSchema.index({ createdBy: 1 });
manualQuotationSchema.index({ status: 1 });

module.exports = mongoose.model('ManualQuotation', manualQuotationSchema);
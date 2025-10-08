// const mongoose = require('mongoose');

// const workCategorySchema = new mongoose.Schema({
//   id: {
//     type: String,
//     // required: true
//   },
//   categoryNumber: {
//     type: Number,
//     // required: true
//   },
//   workCategory: {
//     type: String,
//     // required: true
//   },
//   workType: {
//     type: String,
//     // required: true
//   },
//   task: {
//     type: String,
//     default: ""
//   },
//   materials: {
//     type: String,
//     // required: true
//   },
//   length: {
//     type: String,
//     default: ""
//   },
//   width: {
//     type: String,
//     default: ""
//   },
//   height: {
//     type: String,
//     default: ""
//   },
//   unit: {
//     type: String,
//     default: "sqm"
//   },
//   quantity: {
//     type: String,
//     // required: true
//   },
//   rate: {
//     type: String,
//     // required: true
//   },
//   totalAmount: {
//     type: Number,
//     // required: true
//   },
//   remarks: {
//     type: String,
//     default: ""
//   }
// });

// const workItemSchema = new mongoose.Schema({
//   id: {
//     type: Number,
//     // required: true
//   },
//   serialNo: {
//     type: Number,
//     // required: true
//   },
//   floor: {
//     type: String,
//     // required: true
//   },
//   roomNumber: {
//     type: String,
//     // required: true
//   },
//   projectType: {
//     type: String,
//     // required: true
//   },
//   scopeOfWork: {
//     type: String,
//     // required: true
//   },
//   workCategories: [workCategorySchema]
// });

// const clientDataSchema = new mongoose.Schema({
//   siteName: {
//     type: String,
//     // required: true
//   },
//   clientName: {
//     type: String,
//     // required: true
//   },
//   clientEmail: {
//     type: String,
//     default: ""
//   },
//   clientPhone: {
//     type: String,
//     default: ""
//   },
//   siteAddress: {
//     type: String,
//     default: ""
//   },
//   quotationDate: {
//     type: String,
//     // required: true
//   },
//   validityPeriod: {
//     type: Number,
//     default: 30
//   },
//   notes: {
//     type: String,
//     default: ""
//   }
// });

// // const manualQuotationSchema = new mongoose.Schema({
// //   quotationId: {
// //     type: String,
// //     // required: true,
// //     unique: true
// //   },
// //   siteName: {
// //     type: String,
// //     // required: true
// //   },
// //   clientName: {
// //     type: String,
// //     // required: true
// //   },
// //   generatedDate: {
// //     type: Date,
// //     // required: true
// //   },
// //   updatedDate: {
// //     type: Date,
// //     default: Date.now
// //   },
// //   totalAmount: {
// //     type: Number,
// //     // required: true
// //   },
// //   status: {
// //     type: String,
// //     enum: ['Draft', 'Sent', 'Approved', 'Rejected'],
// //     default: 'Draft'
// //   },
// //   sections: {
// //     type: Number,
// //     // required: true
// //   },
// //   type: {
// //     type: String,
// //     enum: ['manual', 'survey'],
// //     default: 'manual'
// //   },
// //   clientData: clientDataSchema,
// //   workItems: [workItemSchema],
// //   createdBy: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     // required: true
// //   }
// // }
// const manualQuotationSchema = new mongoose.Schema({
//   quotationId: {
//     type: String,
//     // required: true,
//     unique: true
//   },
//   siteName: {
//     type: String,
//     // required: true
//   },
//   clientName: {
//     type: String,
//     // required: true
//   },
//   generatedDate: {
//     type: Date,
//     // required: true
//   },
//   updatedDate: {
//     type: Date,
//     default: Date.now
//   },
//   totalAmount: {
//     type: Number,
//     // required: true
//   },
//   status: {
//     type: String,
//     enum: ['Draft', 'Sent', 'Approved', 'Rejected', 'Revised'], // Added 'Revised' status
//     default: 'Draft'
//   },
//   sections: {
//     type: Number,
//     // required: true
//   },
//   type: {
//     type: String,
//     enum: ['manual', 'survey'],
//     default: 'manual'
//   },
//   clientData: clientDataSchema,
//   workItems: [workItemSchema],
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     // required: true
//   },
//   // NEW FIELDS FOR CLIENT COMMENTS
//   clientRemarks: {
//     type: String,
//     default: ""
//   },
//   workItemComments: {
//     type: mongoose.Schema.Types.Mixed, // Flexible object to store comments by work item and category
//     default: {}
//   }
// }, {
//   timestamps: true
// });


// // Create index for better query performance
// manualQuotationSchema.index({ quotationId: 1 });
// manualQuotationSchema.index({ createdBy: 1 });
// manualQuotationSchema.index({ status: 1 });

// module.exports = mongoose.model('ManualQuotation', manualQuotationSchema);















const mongoose = require('mongoose');

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
  task: {
    type: String,
    default: ""
  },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  clientRemarks: {
    type: String,
    default: ""
  },
  workItemComments: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // NEW FIELD FOR ASSIGNED USER
  assignedTo: assignedUserSchema
}, {
  timestamps: true
});

// Create index for better query performance
manualQuotationSchema.index({ quotationId: 1 });
manualQuotationSchema.index({ createdBy: 1 });
manualQuotationSchema.index({ status: 1 });
manualQuotationSchema.index({ 'assignedTo.userId': 1 });

module.exports = mongoose.model('ManualQuotation', manualQuotationSchema);
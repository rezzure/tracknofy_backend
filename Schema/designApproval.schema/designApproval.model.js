// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     required: true
//   },
//   user: {
//     type: String,
//     required: true
//   },
//   userRole: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// const designSchema = new mongoose.Schema(
//   {
//     siteId: {
//       type: String,
//       required: true,
//     },
//     siteName: {
//       type: String,
//       required: true,
//     },
//     floorName: {
//       type: String,
//     },
//     scopeOfWork: {
//       type: String,
//     },
//     workItem: {
//       type: String,
//     },
//     workType: {
//       type: String,
//     },
//     imageType: {
//       type: String,
//       required: true,
//       enum: ["2D", "3D", "PDF"],
//       trim: true,
//     },
//     title: {
//       type: String,
//     },
//     description: {
//       type: String,
//     },
//     // project: {
//     //   type: String,
//     // },
//     images: [{
//       fieldname: String,
//       originalname: String,
//       mimetype: String,
//       destination: String,
//       filename: String,
//       path: String,
//       size: Number,
//     }],
//     fileName: {
//       type: String,
//     },
//     fileType: {
//       type: String,
//       enum: ["image", "pdf"],
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "createdByModel",
//       required: true,
//     },
//     createdByModel: {
//       type: String,
//       enum: ["Admin", "Supervisor"],
//       required: true,
//     },
//     status: { 
//       type: String,
//       enum: ["pending", "sent", "approved", "review"],
//       default: "pending",
//     },
//     versionNumber: {
//       type: Number,
//       default: 1,
//     },
//     workflow_remark: {
//       type: String,
//       default: ""
//     },
//     comments: [commentSchema],
//     isChatEnabled: {
//       type: Boolean,
//       default: true
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Design", designSchema);

// New Schema

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const designSchema = new mongoose.Schema(
  {
    siteId: {
      type: String,
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    floorName: {
      type: String,
    },
    scopeOfWork: {
      type: String,
    },
    workItem: {
      type: String,
    },
    workType: {
      type: String,
    },
    imageType: {
      type: String,
      required: true,
      enum: ["2D", "3D", "PDF"],
      trim: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    
    // Current version data
    images: [{
      fieldname: String,
      originalname: String,
      mimetype: String,
      destination: String,
      filename: String,
      path: String,
      size: Number,
    }],
    fileName: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ["image", "pdf"],
    },
    
    // Version control fields
    versionNumber: {
      type: Number,
      default: 0,
    },
    versionChanges: {
      type: String,
      default: ""
    },
    status: { 
      type: String,
      enum: ["pending", "sent", "approved", "review"],
      default: "pending",
    },
    isChatEnabled: {
      type: Boolean,
      default: true
    },
    
    // Version history - stores all previous versions
    versionHistory: [{
      versionNumber: {
        type: Number,
        required: true
      },
      images: [{
        fieldname: String,
        originalname: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number,
      }],
      fileName: {
        type: String,
      },
      fileType: {
        type: String,
        enum: ["image", "pdf"],
      },
      versionChanges: {
        type: String,
        default: ""
      },
      status: { 
        type: String,
        enum: ["pending", "sent", "approved", "review"],
      },
      comments: [commentSchema],
      isChatEnabled: {
        type: Boolean,
        default: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "createdByModel"
      },
      createdByModel: {
        type: String,
        enum: ["Admin", "Supervisor"]
      }
    }],
    
    // Common fields for all versions
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    },
    createdByModel: {
      type: String,
      enum: ["Admin", "Supervisor"],
      required: true,
    },
    comments: [commentSchema],
    workflow_remark: {
      type: String,
      default: ""
    },
    
    // Flags
    isLatestVersion: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
designSchema.index({ siteId: 1, isActive: 1 });
designSchema.index({ isLatestVersion: 1 });
designSchema.index({ "versionHistory.versionNumber": 1 });

module.exports = mongoose.model("Design", designSchema);
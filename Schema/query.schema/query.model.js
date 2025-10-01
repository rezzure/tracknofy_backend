// const mongoose = require("mongoose");

// const querySchema = new mongoose.Schema({
// clientId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   required : true,
//   validate: {
//     validator: function(v) {
//       return mongoose.Types.ObjectId.isValid(v);
//     },
//     message: props => `${props.value} is not a valid ObjectId!`
//   }
// },
//  siteName : {
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Site",
//     validate: {
//       validator: function(val) {
//         return mongoose.Types.ObjectId.isValid(val);
//       },
//       message: 'Invalid site value'
//     }
//   },
//   client : {
//     type : String,
    
//   },
//   queryType: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   photos: [
//     {
//       type: String, // URLs to uploaded photos stored in cloud storage or server
//     },
//   ],
//   status: {
//     type: String,
//     enum: ["open", "closed"],
//     default: "open",
//   },
//    clientReply: {
//     type: String,
//     trim: true
//   },
//    adminResponse: {
//     type: String,
//     trim: true
//   },
//   respondedAt: {
//     type: Date
//   },
//   // Comment: Communication thread between admin and client
//   communications: [
//     {
//       sender: {
//         type: String,
//         enum: ["client", "admin"],
//         required: true,
//         default: "client",
//       },
//       message: {
//         type: String,
//         required: true,
//       },
//       attachments: [
//         {
//           type: String, // URLs to any additional attachments
//         },
//       ],
//       sentAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   closedAt: {
//     type: Date,
//   },
// });


// //Comment: Middleware to update the updatedAt field before saving
// querySchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });


// const Query = mongoose.model("Query", querySchema);

// module.exports = Query;




// const mongoose = require("mongoose");

// const querySchema = new mongoose.Schema({
//   clientId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     validate: {
//       validator: function(v) {
//         return mongoose.Types.ObjectId.isValid(v);
//       },
//       message: props => `${props.value} is not a valid ObjectId!`
//     }
//   },
//   siteName: {
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Site",
//     validate: {
//       validator: function(val) {
//         return mongoose.Types.ObjectId.isValid(val);
//       },
//       message: 'Invalid site value'
//     }
//   },
//   client: {
//     type: String,
//   },
//   queryType: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   photos: [
//     {
//       type: String, // URLs to uploaded photos stored in cloud storage or server
//     },
//   ],
//   status: {
//     type: String,
//     enum: ["open", "assigned", "in-progress", "resolved", "closed"],
//     default: "open",
//   },
//   clientReply: {
//     type: String,
//     trim: true
//   },
//   adminResponse: {
//     type: String,
//     trim: true
//   },
//   respondedAt: {
//     type: Date
//   },
//   // Assignment fields
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     validate: {
//       validator: function(v) {
//         return !v || mongoose.Types.ObjectId.isValid(v);
//       },
//       message: props => `${props.value} is not a valid ObjectId!`
//     }
//   },
//   assignedToName: {
//     type: String,
//     trim: true
//   },
//   assignedRole: {
//     type: String,
//     trim: true
//   },
//   assignmentNotes: {
//     type: String,
//     trim: true
//   },
//   assignedAt: {
//     type: Date
//   },
//   // Resolution fields
//   resolvedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },
//   resolvedByName: {
//     type: String,
//     trim: true
//   },
//   resolutionNotes: {
//     type: String,
//     trim: true
//   },
//   resolvedAt: {
//     type: Date
//   },
//   // Comment: Communication thread between admin and client
//   communications: [
//     {
//       sender: {
//         type: String,
//         enum: ["client", "admin", "assigned_user"],
//         required: true,
//         default: "client",
//       },
//       senderName: {
//         type: String,
//         trim: true
//       },
//       message: {
//         type: String,
//         required: true,
//       },
//       attachments: [
//         {
//           type: String, // URLs to any additional attachments
//         },
//       ],
//       sentAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   closedAt: {
//     type: Date,
//   },
// });

// // Middleware to update the updatedAt field before saving
// querySchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// const Query = mongoose.model("Query", querySchema);
// module.exports = Query;



const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: function(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: props => `${props.value} is not a valid ObjectId!`
    }
  },
  siteName: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Site",
    validate: {
      validator: function(val) {
        return mongoose.Types.ObjectId.isValid(val);
      },
      message: 'Invalid site value'
    }
  },
  client: {
    type: String,
  },
  queryType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: String, // URLs to uploaded photos stored in cloud storage or server
    },
  ],
  status: {
    type: String,
    enum: ["open", "assigned", "in-progress", "resolved", "closed"],
    default: "open",
  },
  clientReply: {
    type: String,
    trim: true
  },
  adminResponse: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  },
  // Assignment fields
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: function(v) {
        return !v || mongoose.Types.ObjectId.isValid(v);
      },
      message: props => `${props.value} is not a valid ObjectId!`
    }
  },
  assignedToName: {
    type: String,
    trim: true
  },
  assignedRole: {
    type: String,
    trim: true
  },
  assignmentNotes: {
    type: String,
    trim: true
  },
  assignedAt: {
    type: Date
  },
  // Ticket reference
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    validate: {
      validator: function(v) {
        return !v || mongoose.Types.ObjectId.isValid(v);
      },
      message: props => `${props.value} is not a valid ObjectId!`
    }
  },
  // Resolution fields
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resolvedByName: {
    type: String,
    trim: true
  },
  resolutionNotes: {
    type: String,
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  // Communication thread between admin and client
  communications: [
    {
      sender: {
        type: String,
        enum: ["client", "admin", "assigned_user"],
        required: true,
        default: "client",
      },
      senderName: {
        type: String,
        trim: true
      },
      message: {
        type: String,
        required: true,
      },
      attachments: [
        {
          type: String, // URLs to any additional attachments
        },
      ],
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
  },
});

// Middleware to update the updatedAt field before saving
querySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Query = mongoose.model("Query", querySchema);
module.exports = Query;
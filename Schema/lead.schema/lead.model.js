// // const mongoose = require("mongoose")
// // const leadSchema = new mongoose.Schema({
// //   name:{
// //     type:String,
// //     required:true,
// //   },
// //   email:{
// //     type:Date,
// //     required:true,
// //   },
// //   mobile:{
// //     type:String,
// //   },
// //   address:{
// //     type:String,
// //   },
// //   leadSource:{
// //     // type: mongoose.Schema.Types.ObjectId,
// //     type:String,
// //   },
// //    assign:{
// //     // type: mongoose.Schema.Types.ObjectId,
// //     type:String,
// //     // required:true,
// //   },
// //     projectType:{
// //         type: String,
// //     },
// //     leadType:{
// //         type: String,
// //         enum: ['hot lead', 'warm lead','cold lead']
// //     },
// //     lastContact:{
// //         type: Date,
// //         default: Date.now
// //     },
// //     nextContact:[{
// //         date: {
// //             type: Date,
// //         },
// //         description:{
// //             type: String
// //         }
// //     }],
// //     tentativeValue:{
// //       type: String
// //     }
  
// // },{timestamps:true})

// // const Lead = mongoose.model ("Lead", leadSchema)

// // module.exports = Lead





// const mongoose = require("mongoose");

// const leadSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String, // Changed from Date to String
//     required: true,
//   },
//   mobile: {
//     type: String,
//   },
//   address: {
//     type: String,
//   },
//   leadSource: {
//     type: String,
//   },
//   assign: {
//     type: String,
//   },
//   projectType: {
//     type: String,
//   },
//   leadType: {
//     type: String,
//     enum: ['hot lead', 'warm lead', 'cold lead']
//   },
//   description: { // Add this field if you want to store descriptions
//     type: String,
//   },
//   lastContact: {
//     type: Date,
//     default: Date.now
//   },
//   nextContact: [{
//     date: {
//       type: Date,
//     },
//     description: {
//       type: String
//     }
//   }],
//   tentativeValue: {
//     type: String
//   }
// }, { timestamps: true });

// const Lead = mongoose.model("Lead", leadSchema);
// module.exports = Lead;




// updated schema 

// const mongoose = require("mongoose");

// const conversationSchema = new mongoose.Schema({
//   lastContact: {
//     type: Date,
//     default: Date.now
//   },
//   nextContact: {
//     type: Date,
//     required: true
//   },
//   timeSlot: {
//     type: String,
//     required: true
//   },
//   comments: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// const leadSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     // required: true,
//   },
//   mobile: {
//     type: String,
//     required: true,
//   },
//   spocName: {
//     type: String,
//     default: ''
//   },
//   spocMobile: {
//     type: String,
//     default: ''
//   },
//   address: {
//     type: String,
//     // required: true,
//   },
//   leadSource: {
//     type: String,
//     // required: true,
//   },
//   assign: {
//     type: String,
//     // required: true,
//   },
//   projectType: {
//     type: String,
//     // required: true,
//   },
//   leadType: {
//     type: String,
//     enum: ['hot lead', 'warm lead', 'cold lead'],
//     required: true
//   },
//   leadStatus: {
//     type: String,
//     enum: ['new leads', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed won', 'lost'],
//     default: 'new leads'
//   },
//   description: {
//     type: String,
//     default: ''
//   },
//   tentativeValue: {
//     type: Number,
//     default: 0
//   },
//   lost: {
//     type: String,
//     default: ''
//   },
//   conversations: [conversationSchema],
//   lastContact: {
//     type: Date,
//     default: Date.now
//   },
//   nextContact: {
//     type: Date
//   }
// }, { timestamps: true });

// const Lead = mongoose.model("Lead", leadSchema);
// module.exports = Lead;



// not required 

// const mongoose = require("mongoose");

// const conversationSchema = new mongoose.Schema({
//   lastContact: {
//     type: Date,
//     default: Date.now
//   },
//   nextContact: {
//     type: Date,
//     required: true
//   },
//   timeSlot: {
//     type: String,
//     required: true
//   },
//   comments: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// const leadSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     default: ''
//   },
//   mobile: {
//     type: String,
//     required: true,
//   },
//   spocName: {
//     type: String,
//     default: ''
//   },
//   spocMobile: {
//     type: String,
//     default: ''
//   },
//   address: {
//     type: String,
//     default: ''
//   },
//   leadSource: {
//     type: String,
//     default: ''
//   },
//   assign: {
//     type: String,
//     default: ''
//   },
//   projectType: {
//     type: String,
//     default: ''
//   },
//   leadType: {
//     type: String,
//     enum: ['hot lead', 'warm lead', 'cold lead', ''],
//     default: ''
//   },
//   leadStatus: {
//     type: String,
//     enum: ['new leads', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed won', 'lost'],
//     default: 'new leads'
//   },
//   description: {
//     type: String,
//     default: ''
//   },
//   tentativeValue: {
//     type: Number,
//     default: 0
//   },
//   lost: {
//     type: String,
//     default: ''
//   },
//   conversations: [conversationSchema],
//   lastContact: {
//     type: Date,
//     default: Date.now
//   },
//   nextContact: {
//     type: Date
//   }
// }, { timestamps: true });

// const Lead = mongoose.model("Lead", leadSchema);
// module.exports = Lead;




// project category

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  lastContact: {
    type: Date,
    default: Date.now
  },
  nextContact: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: ''
  },
  mobile: {
    type: String,
    required: true,
  },
  spocName: {
    type: String,
    default: ''
  },
  spocMobile: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  leadSource: {
    type: String,
    default: ''
  },
  assign: {
    type: String,
    default: ''
  },
  projectType: {
    type: String,
    default: ''
  },
  // --- ADDED FIELD ---
  projectCategory: {
    type: String,
    // Ensures only these values (or an empty string) can be saved
    enum: ['interior', 'exterior', 'construction', 'architecture', 'renovation', ''],
    default: ''
  },
  // --------------------
  leadType: {
    type: String,
    enum: ['hot lead', 'warm lead', 'cold lead', ''],
    default: ''
  },
  leadStatus: {
    type: String,
    enum: ['new leads', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed won', 'lost'],
    default: 'new leads'
  },
  description: {
    type: String,
    default: ''
  },
  tentativeValue: {
    type: Number,
    default: 0
  },
  lost: {
    type: String,
    default: ''
  },
  conversations: [conversationSchema],
  lastContact: {
    type: Date,
    default: Date.now
  },
  nextContact: {
    type: Date
  }
}, { timestamps: true });

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
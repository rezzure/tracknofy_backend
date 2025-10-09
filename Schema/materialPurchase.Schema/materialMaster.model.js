
// const mongoose = require('mongoose');

// const materialMasterSchema = new mongoose.Schema({
//   materialType: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   materialName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   unit: {
//     type: String,
//     required: true,
//     enum: ['bags', 'kg', 'tons', 'liters', 'pieces'],
//     default: 'bags'
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {timestamps : true});


//  const MaterialMaster = mongoose.model('MaterialMaster', materialMasterSchema);


//  module.exports=MaterialMaster;
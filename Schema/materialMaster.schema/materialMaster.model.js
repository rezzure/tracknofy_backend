const mongoose = require('mongoose')
const Admin = require('../admin.schema/admine.model')
const materialMasterSchema = new mongoose.Schema({
    materialType:{
        type:String,
        required: true
    },
    materialSize:{
        type: String,
        required: true
    },
    measurementType:{
        type: String,
    },
    materialName:{
        type: String,
        required: true
    },
    materialRate:{
        type: String,
        required: true
    },
    materialBrand:{
        type: String,
        required: true
    },
    materialPhoto: {
    type: String, // Store file path
    required: false
  },
    remarks:{
        type: String,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        // ref: 'Admin',
        refPath: 'createdByModel', // Points to field that specifies which model
        required: true
    },
    createdByModel: {
        type: String,
        enum: ['Admin', 'Supervisor'],  // Allowed model names
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},{timestamps:true})

const MaterialMaster = mongoose.model('MaterialMaster',materialMasterSchema)

module.exports = MaterialMaster
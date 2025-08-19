const mongoose = require('mongoose')
const Admin = require('../admin.schema/admine.model')
const materialMasterSchema = new mongoose.Schema({
    materialType:{
        type:String,
        required: true
    },
    materialName:{
        type: String,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},{timestamps:true})

const MaterialMaster = mongoose.model('MaterialMaster',materialMasterSchema)

module.exports = MaterialMaster
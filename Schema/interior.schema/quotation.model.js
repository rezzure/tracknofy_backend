const mongoose = require("mongoose")
const quotationMasterSchema = new mongoose.Schema({
    projectTypeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MasterTypeConfig"
    },
    projectType:{
        type:String,
        required:true
    },
    scopeOfWork:{
        type:String,
        required:true
    },
   
    workItems:[{
        item:{
        type:String,
        required:true
    }
    }],
    createdBy:{
        type:String,
        required:true,
        default:"admin"
    },
    isActive:{
        type:Boolean,
        default:true
    },
    updatedAt:{
        type:Date
    }
},{timestamps:true})

const Quotation = mongoose.model("Quotation",quotationMasterSchema)
module.exports = Quotation
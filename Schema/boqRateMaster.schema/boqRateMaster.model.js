const mongoose = require("mongoose");

const boqRateMasterSchema = new mongoose.Schema({
  projectTypeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"MasterTypeConfig",
    required:true
  },
  projectType:{
    type:String,
    required:true
  },
  scopeOfWorkId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Quotation",
    required:true
  },
  scopeOfWork:{
    type:String,
    required:true
  },
  workItemId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Quotation",
    required: true
  },
  workItem:{
    type:String,
    required:true
  },
  baseRate: {
    rate:{
        type:Number,
    },
    rateDescription:{
        type:String
    }
  },
  averageRate: {
    rate:{
        type:Number,
    },
    rateDescription:{
        type:String
    }
  },
  premiumRate: {
    rate:{
        type:Number,
    },
    rateDescription:{
        type:String
    }
  },
  remarks: {
    type: String
  },
  createdBy: {
    type: String,
    default: "admin"
  },
  updatedAt: {
    type: Date,
  },
},

{
  timestamps: true
});

const BoqRateMaster = mongoose.model("BoqRateMaster", boqRateMasterSchema);

module.exports = BoqRateMaster;
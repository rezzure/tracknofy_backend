const mongoose = require("mongoose");

const boqRateMasterSchema = new mongoose.Schema({
  workItem: {
    type: String,
    required: true
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
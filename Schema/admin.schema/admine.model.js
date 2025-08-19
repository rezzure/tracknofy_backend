const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    totalReceived:{
      type:Number,
      default:0
    },
    totalAllocated:{
      type:Number,
      default:0
    },
    featureId: {  
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Feature', 
    default: [] 
    },
    featuresName:{
      type:[String],

    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);

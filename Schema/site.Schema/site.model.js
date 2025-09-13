const mongoose = require("mongoose");
const Supervisor = require("../supervisor.schema/supervisor.model");
const {Schema}= mongoose;
const siteSchema = new Schema({
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    // maxlength: [100, 'Site name cannot exceed 100 characters']
  },
  address: {
    type:String,
    required:true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  clientName:{
    type:String,
    required:true
  },
  supervisorId: {
    type: Schema.Types.ObjectId,
    ref: 'Supervisor',
  },
  supervisorName:{
    type:String,
    required:true
  },
  totalAmount:{
    type:Number,
    default:0
  },
  totalExpense:{
    type:Number,
    default:0
  },
  lastPayment:{
    type:Number,
    default:0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'under_construction', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true 
  },
  lastPaymentUpdatedAt:{
    type:Date,
  }
},{timestamps:true})

const Site = mongoose.model("Site",siteSchema)
module.exports = Site;

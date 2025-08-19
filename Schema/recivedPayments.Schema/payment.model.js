const mongoose = require("mongoose");
const {Schema} = mongoose;
const paymentSchema = new Schema({
    clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client', 
    required: [true, 'Client ID is required']
  },
  clientName:{
    type:String,
    required:true
  },
  siteName: {
    type: String,
    required: [true, 'Site name is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  mode: {
    type: String,
    required: [true, 'Payment mode is required'],
    enum: {
      values: ['credit_card', 'debit_card', 'Bank Transfer', 'UPI', 'Cash', 'Cheque', 'other'],
      message: '{VALUE} is not a valid payment mode'
    }
  },
  transactionDate: {
    type: Date,
    // required: [true, 'Transaction date is required'],
    default: Date.now
  },
  receiptURL: {
    type: String,
    // validate: {
    //   validator: function(v) {
    //     return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid URL!`
    // }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'failed', 'refunded'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  transactionId:{
    type:Number,
    required:true,
  }
})

const Payments = mongoose.model("Payment",paymentSchema);
module.exports = Payments
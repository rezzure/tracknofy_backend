const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  // clientId:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User"
  // },
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  email:{
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    
  },
  lastPayment:{
    type:Number,
    default:0
  },
  sitename: {
    type: String,
    // required: [true, 'Site name is required'],
    trim: true,
    maxlength: [100, 'Site name cannot exceed 100 characters']
  },
  total_payment: {
    type: Number,
    // required: [true, 'Total payment is required'],
    min: [0, 'Total payment cannot be negative'],
    default: 0
  },
  total_expense: {
    type: Number,
    // required: [true, 'Total expense is required'],
    min: [0, 'Total expense cannot be negative'],
    default: 0
  },
  balance_amount: {
    type: Number,
    // required: [true, 'Balance amount is required'],
    default: function() {
      return this.total_payment - this.total_expense;
    }
  },
  supervisor_name: {
    type: String,
    trim: true,
    maxlength: [100, 'Supervisor name cannot exceed 100 characters']
  },
  last_payment: {
    type: Date,
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Last payment date cannot be in the future'
    }
  }
}, {
  timestamps: true, 
});


const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
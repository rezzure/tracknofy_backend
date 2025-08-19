const mongoose = require('mongoose');
const {Schema} = mongoose;

const image = new mongoose.Schema({
  fieldname: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  destination: { type: String, required: true }, // Changed from Number to String
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true }, // Changed from String to Number
  uploadedAt: { type: Date, default: Date.now },
});

const expenseSchema = new Schema({
  siteName:{
    type:String,
    required:true
  },
  supervisor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Supervisor',
    required: true
  },
  supervisorEmail:{
    type:String,
    required:true
  },
  supervisorName: {
    type: String,
    required: true
  },
  expenseType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  image:image,
  status: {
    type: String,
    default: 'pending'
  },
  adminComment: {
    type: String,
    required: false
  }
}, {
  timestamps: true 
});

const Expense = mongoose.model("Expense",expenseSchema)

module.exports = Expense;
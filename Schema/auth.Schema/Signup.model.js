const mongoose = require("mongoose");
const ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  CLIENT: 'client',
};
// const SignuoSchema = new mongoose.Schema({
//     email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
//   },
//   password: {
//     type: String,
//     required: true,
//     // minlength: 6,
//     // select: false, 
//   },
//   role: {
//     type: String,
//     enum: Object.values(ROLES), 
//     // default: ROLES.CLIENT, 
//     // required: true,
//   },
//   firstName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   phone_number:{
//     type: Number,
//     required: true,
//     length: 10,
//   },
//   total_payment:{
//     type: Number,
//     default: 0,
//   },
//   total_expense:{
//     type: Number,
//     default: 0,
//   },
//   balance_amount:{
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   }, 
// });

const Users = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    // match: [/^[0-9]{10,15}$/, 'Please fill a valid mobile number']
  },
  role: {
    type: String,
    enum: ['admin', 'supervisor', 'client'],
    default: 'client',
    required: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    // minlength: [8, 'Password must be at least 8 characters'],
    // select: false // Never return password in queries
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Signup = mongoose.model("Signup",Users);
module.exports = {Signup,ROLES};
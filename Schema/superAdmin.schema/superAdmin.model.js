const mongoose = require("mongoose")

const superAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    default : "Prabhat Rai" 
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
    type: Number,
    default : '+919990490774'
  },
  role: {
    type: String,
    default : 'Super Admin'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    // minlength: [8, 'Password must be at least 8 characters'],
    // select: false // Never return password in queries
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const SuperAdmin = mongoose.model("SuperAdmin",superAdminSchema)
module.exports = SuperAdmin
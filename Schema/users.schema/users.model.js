const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
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
const User = mongoose.model("User",userSchema)
module.exports = User
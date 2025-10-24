const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportingTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: ""
  },
  employmentType: {
    type: String,
    default: ""
  },
  probationPeriod: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
module.exports = UserDetails;
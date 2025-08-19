const mongoose = require("mongoose");

const fundAllocationSchema = new mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  supervisorName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  purpose: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
},{timestamps:true});

const FundAllocation = mongoose.model("FundAllocation",fundAllocationSchema);

module.exports = FundAllocation;
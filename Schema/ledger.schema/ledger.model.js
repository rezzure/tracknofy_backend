const mongoose = require("mongoose")
const ledgerSchema = new mongoose.Schema({
  type:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
    required:true,
  },
  from:{
    type:String,
    required:true
  },
  to:{
    type:String,
    required:true,
  },
  amount:{
    type:Number,
    required:true,
  },
},{timestamps:true})

const Ledger = mongoose.model ("ledger",ledgerSchema)

module.exports = Ledger
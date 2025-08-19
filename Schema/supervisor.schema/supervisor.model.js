const mongoose = require("mongoose");

const SupervisorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Supervisor name is required'],
        trim: true,
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        unique: true,
        trim: true,
    },
    mobile:{
        type:Number,
        required:[true, 'Mobile number is required'],
        unique: true,
        length: [10, 'Mobile number must be 10 digits'],
    },
    site_name: {
        type: [String],  // Array of strings
        default: [],     // Initialize as empty array
        trim: true       // Trim whitespace from each string
    },
    allorted_client:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Client',
        // required: [true, 'Allotted client is required']
    },
    total_payment:{
        type:Number,
        default: 0,
    },
    total_expense:{
        type:Number,
        default: 0,
    },
    balance_amount:{
        type:Number,
        default: 0, 
    },
    statu:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

})

const Supervisor = mongoose.model("Supervisor", SupervisorSchema);
module.exports = Supervisor;
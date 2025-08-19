const mongoose = require("mongoose");
const {Schema} = mongoose;

const roleSchema = new Schema({
    roleName:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        maxlength:200,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"Admin",
        required:true,
    }
},{timestamps:true});

const Role = mongoose.model("Role",roleSchema)
module.exports = Role
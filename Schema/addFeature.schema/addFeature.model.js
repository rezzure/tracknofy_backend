const mongoose = require("mongoose");
const { Schema } = mongoose;
const featuresSchema = new Schema({
    featuresCategories: {
        type: String,
        required: true,
        trim: true
    },
    featureName: {
        type: "String",
        required: true,
        unique: true
    },
    path:{
        type:String,
        required:true
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

}, { timestamps: true })
module.exports = mongoose.model("Feature", featuresSchema)
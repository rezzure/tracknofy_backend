const mongoose = require("mongoose");
const { Schema } = mongoose;
const featuresSchema = new Schema({
    featureName: {
        type: "String",
        required: true,
        unique: true
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
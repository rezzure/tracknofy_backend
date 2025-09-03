const mongoose = require("mongoose");
const {Schema} = mongoose;

const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    features: [
      {
        featureName: {
          type: String,
          required: true,
          trim: true,
        },
        path: {
          type: String,
          required: true,
          trim: true,
        },
        icon: {
          type: String,
          required: true,
          // trim: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      // required:true,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role",roleSchema)
module.exports = Role
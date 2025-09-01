const mongoose = require('mongoose')

const MasterConfigSchema = new mongoose.Schema(
  {
    master_type_id: {
      type: String, // You can also use ObjectId if needed
      required: true,
      unique: true,
      trim: true,
    },
    master_type_name: {
      type: String,
      required: true,
      trim: true,
    },
    master_type_description: {
      type: String,
      default: "",
      trim: true,
    },
    created_by: {
      type: String, // store user_id or username
      // required: true,
    },
    updated_by: {
      type: String, // store user_id or username
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, // auto manages created_at & updated_at
    collection: "master_configurations", // collection name
  }
);

module.exports = mongoose.model("MasterTypeConfig", MasterConfigSchema);

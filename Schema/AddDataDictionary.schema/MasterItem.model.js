import mongoose from "mongoose";

const MasterItemSchema = new mongoose.Schema(
  {
    master_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterConfigSchema", // reference to master_type
      required: true,
    },
    master_item_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    master_item_name: {
      type: String,
      required: true,
      trim: true,
    },
    master_item_description: {
      type: String,
      default: "",
      trim: true,
    },

    created_by: {
      type: String,
      required: true,
    },
    updated_by: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "master_items",
  }
);

module.exports = mongoose.model("MasterItem", MasterItemSchema);

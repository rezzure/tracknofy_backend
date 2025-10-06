const mongoose =  require('mongoose');

const MasterItemSchema = new mongoose.Schema(
  {
    master_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterConfigSchema", // reference to master_type
      // required: true,
    },
    master_type_name: {
      type: String,
      required: true
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

const  MasterItem = mongoose.model("MasterItem", MasterItemSchema);

module.exports = MasterItem

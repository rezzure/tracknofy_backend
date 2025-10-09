// models/GRN.js
const mongoose = require('mongoose');

const grnMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  orderedQuantity: {
    type: Number,
    required: true
  },
  deliveredQuantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

const grnSchema = new mongoose.Schema({
  grnId: {
    type: String,
    unique: true,
    required: true
  },
  purchaseOrderId: {
    type: String,
    required: true
  },
  siteName: {
    type: String,
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  materials: [grnMaterialSchema],
  deliveryDate: {
    type: Date,
    default: Date.now
  },
  receivedBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['delivered', 'partial'],
    required: true
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const GRN = mongoose.model('GRN', grnSchema);

module.exports=GRN;
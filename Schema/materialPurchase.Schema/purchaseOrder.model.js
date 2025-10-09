const mongoose = require('mongoose');

const poMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const purchaseOrderSchema = new mongoose.Schema({
  poId: {
    type: String,
    unique: true,
    required: true
  },
  requestIds: [{
    type: String,
    required: true
  }],
  siteName: {
    type: String,
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  materials: [poMaterialSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'delivered', 'cancelled'],
    default: 'pending'
  },
  expectedDelivery: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  }
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

module.exports=PurchaseOrder
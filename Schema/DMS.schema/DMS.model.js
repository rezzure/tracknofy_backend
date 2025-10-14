const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['folder', 'file'],
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null,
  },
  filePath: {
    type: String,
  },
  size: {
    type: Number, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
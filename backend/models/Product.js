const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, required: true, default: 0, min: 0 },
  categoryId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images:      [{ type: String }],
  isDeleted:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

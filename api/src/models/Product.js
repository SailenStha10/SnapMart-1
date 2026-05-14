import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true
  },

  description: String,

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    default: 0
  },

  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  images: [String],

  is_deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true
  },

  image_url: String,

  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }
});

export default mongoose.model("Category", categorySchema);
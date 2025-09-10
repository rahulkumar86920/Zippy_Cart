import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: " ",
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, 
    },
  },
  {
    timestamp: true,
  }
);

const productModel = mongoose.model("PRODUCT", productSchema);
export default productModel;

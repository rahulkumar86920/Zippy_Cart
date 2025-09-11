import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "PRODUCT",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "USER",
    },
    quantity: {
      type: Number,
      default: 1,
      min:1
    },
  },
  {
    timestamps: true,
  }
);

const cartProductModel = mongoose.model("CARTITEM", cartProductSchema);
export default cartProductModel;
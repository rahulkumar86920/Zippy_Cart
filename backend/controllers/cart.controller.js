import cartProductModel from "../models/cart.model.js";
import createError from "http-errors"; // Added missing import

// get function
export const getCart = async (req, res, next) => {
  try {
    const item = await cartProductModel.find({ userId: req.user._id }).populate({
      path: "productId",  // Changed from "product"
      model: "PRODUCT",   // Changed from "CARTITEM" to "PRODUCT"
    });

    const formatted = item.map((ci) => ({
      _id: ci._id.toString(),
      product: ci.productId,  // Changed from ci.product
      quantity: ci.quantity,
    }));
    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

//post method to add to cart item
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, itemId } = req.body;
    console.log("Received backend:", req.body);

    const pId = productId || itemId;
    if (!pId || typeof quantity !== "number") {
      throw createError(400, "product identifier and quantity required");
    }

    const cartItem = await cartProductModel.findOne({
      userId: req.user._id,      // Changed from "user"
      productId: pId,            // Changed from "product"
    });

    if (cartItem) {
      cartItem.quantity = Math.max(1, cartItem.quantity + quantity);
      if (cartItem.quantity < 1) {
        await cartItem.deleteOne();
        return res.status(200).json({
          message: "Item removed",
          _id: cartItem._id.toString(),
        });
      }
      await cartItem.save();
      await cartItem.populate("productId");  // Changed from "product"
      return res.status(200).json({
        _id: cartItem._id.toString(),
        product: cartItem.productId,         // Changed from cartItem.product
        quantity: cartItem.quantity,
      });
    }

    // Create new cart item
    const newCartItem = await cartProductModel.create({
      userId: req.user._id,      // Changed from "user"
      productId: pId,            // Changed from "product"
      quantity,
    });

    // Populate the productId field
    await newCartItem.populate("productId");  // Changed from "product"
    res.status(200).json({
      _id: newCartItem._id.toString(),
      product: newCartItem.productId,         // Changed from newCartItem.product
      quantity: newCartItem.quantity,
    });
  } catch (error) {
    next(error);
  }
};

// put method to update the cart item
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cartItem = await cartProductModel.findOne({
      _id: req.params.id,
      userId: req.user._id,      // Changed from "user"
    });

    if (!cartItem) {
      throw createError(404, "Cart item not found");
    }

    cartItem.quantity = Math.max(1, quantity);
    await cartItem.save();
    await cartItem.populate("productId");    // Changed from "product"
    res.json({
      _id: cartItem._id.toString(),
      product: cartItem.productId,           // Changed from cartItem.product
      quantity: cartItem.quantity,
    });
  } catch (error) {
    next(error);
  }
};

// delete method to delete the cart items
export const deleteCartItem = async (req, res, next) => {
  try {
    const cartItem = await cartProductModel.findOne({
      _id: req.params.id,
      userId: req.user._id,      // Changed from "user"
    });
    if (!cartItem) {
      throw createError(404, "cart item not found");
    }
    await cartItem.deleteOne();
    res.json({
      message: "item deleted",
      _id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// clear cart method
export const clearCart = async (req, res, next) => {
  try {
    await cartProductModel.deleteMany({ userId: req.user._id }); // Changed from "user"
    res.json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};
import cartProductModel from "../models/cart.model.js";

// get function
export const getCart = async (req, res, next) => {
  try {
    const item = await cartProductModel.find({ user: req.user._id }).populate({
      path: "product",
      model: "CARTITEM",
    });

    const formatted = item.map((ci) => ({
      _id: ci_id.toString(),
      product: ci.product,
      quantity: ci.quantity,
    }));
    res.json(formatted);
  } catch (error) {}
};

//post method to add to cart item
export const postCart = async (req, res, next) => {
  try {
    const { productId, quantity, itemId } = req.body;
    const pId = productId || itemId;

    if (!pId || typeof quantity !== "number") {
      throw createError(400, "product identifier and quantity required");
    }

    const cartItem = await cartProductModel.findOne({
      user: req.user._id,
      product: pId,
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
      await cartItem.populate("product");
      return res.status(200).json({
        _id: cartItem._id.toString(),
        product: cartItem.product,
        quantity: cartItem.quantity,
      });
    }

    cartItem = await cartItem.create({
      user: req.user._id,
      product: pId,
      quantity,
    });
    await cartItem.populate("product");
    res.status(200).json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
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
      user: req.user._id,
    });

    if (!cartItem) {
      throw createError(404, "Cart item not found");
    }

    cartItem.quantity = Math.max(1, quantity);
    await cartItem.save();
    await cartItem.populate("product");
    res.json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
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
      user: req.user._id,
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

// creal cart method
export const clearCart = async (req, res, next) => {
  try {
    await cartProductModel.deleteMany({ user: req.user._id });
    res.json({ message: " Cart cleared" });
  } catch (error) {
    next(error);
  }
};

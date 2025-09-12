import orderModel from "../models/order.model.js";
import { v4 as uuidv4 } from "uuid";
import Stripe from 'stripe';

// stripe for the online payment
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

//create a new order
export const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes, deliveryDate } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({
        message: " Invalid or empty items Array",
      });
    }

    const normalizedPM =
      paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment";
    const orderItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price),
      quantity: Number(i.quantity),
      imageUrl: i.imageUrl,
    }));

    const orderId = `ORD${uuidv4()}`;
    let newOrder;

    // for online paymet
    if (normalizedPM === "Online Payment") {
      const session = await Stripe.checkout.sessions.create({
        payment_method_type: ["card"],
        mode: "payment",
        line_items: orderItems.map((o) => ({
          price_data: {
            currency: "inr",
            product_data: { name: o.name },
            unit_amount: Math.round(o.price * 100),
          },
          quantity: o.quantity,
        })),
        customer_email: customer_email,
        success_url: `${process.env.FRONTEND_URL}/myorder/verify?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
        metadata: { orderId },
      });
      newOrder = new Order({
        orderId,
        user: req.user._id,
        customer,
        items: orderItems,
        shipping: 0,
        paymentMethod: normalizedPM,
        paymentStatus: "Unpaid",
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        notes,
        deliveryDate,
      });

      await newOrder.save();
      return res
        .status(201)
        .json({ order: newOrder, checkoutUrl: session.url });
    }
    // cod order
    newOrder = new Order({
      orderId,
      user: req.user._id,
      customer,
      items: orderItems,
      shipping: 0,
      paymentMethod: normalizedPM,
      paymentStatus: "Paid",
      notes,
      deliveryDate,
    });

    await newOrder.save();
     res.status(201).json({ order: newOrder, checkoutUrl: null });
  } catch (error) {
    console.log("create order error", error);
    res.status(500).json({ message: "server error ", error: error.message });
  }
};

// confirm stripe payment for the online payment method
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id)
      return res.status(400).json({ message: "session_id_required" });
    const session = await Stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await orderModel.findOneAndUpdate(
      { sessionId: session_id },
      { paymentStatus: "Paid" },
      { new: true }
    );

    if (!order) return res.status(400).json({ message: "order not found" });
    res.json(order);
  } catch (error) {
    console.log("confirm Payment error", error);
    res.status(500).json({ message: "server error ", error: error.message });
  }
};

// get all the orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    console.log("get all orders error", error);
    next(error);
  }
};

//get orders by id
export const getOrdersById = async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }
    res.json(order);
  } catch (error) {
    console.log("getOrderById error", error);
    next(error);
  }
};

// update order by id
export const updateOrder = async (req, res, next) => {
  try {
    const allowed = ["status", "paymentStatus", "deliveryDate", "notes"];
    const updateData = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updated = await orderModel
      .findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!updated) {
      return res.status(404).json({ message: "order not found" });
    }
    res.json(updated);
  } catch (error) {
    console.log("updateOrders error", error);
    next(error);
  }
};

// delete method to delete orders
export const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "order not found" });
    res.json({ message: "order deleted successfully" });
  } 
  catch (error) {
    console.log("deleteOrder erre", error);
    next(error);
  }
};

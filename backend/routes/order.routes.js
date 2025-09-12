import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  confirmPayment,
  createOrder,
  deleteOrder,
  getOrders,
  getOrdersById,
  updateOrder,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

// protected routes
orderRouter.post("/", authMiddleware, createOrder);
orderRouter.get("/confirm", authMiddleware, confirmPayment);

// public routes
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrdersById);
orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;

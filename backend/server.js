import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";

import userRouter from "./routes/user.routes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import itemrouter from "./routes/product.routes.js";
import authMiddleware from "./middleware/auth.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
const app = express();

// port number where our server is going to run
const PORT = 8080 || process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middle ware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5173"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("not allowed by the cors"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.send("Api is working");
});

app.use("/api/user", userRouter); // register and login
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/items", itemrouter); // cretae, get, and delete products from admin panel
app.use("/api/orders", orderRouter);

//here calling the connect db function
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
  });
});

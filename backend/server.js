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
      const allowedOrigins = [
        "https://zippy-cart-frontend.onrender.com",
        "https://zippy-cart-admin.onrender.com",
      ];
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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ZippyCart Backend</title>
      <style>
        body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background: #f4f6f8;
          color: #333;
          text-align: center;
        }
        .container {
          max-width: 500px;
          background: #fff;
          padding: 25px 20px;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          animation: fadeIn 0.6s ease-in-out;
        }
        h1 {
          font-size: 22px;
          margin-bottom: 10px;
          color: #007BFF;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 15px;
        }
        a {
          display: inline-block;
          margin-top: 10px;
          padding: 10px 15px;
          background: #007BFF;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.3s ease;
        }
        a:hover {
          background: #0056b3;
        }
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1> ZippyCart Backend Running</h1>
        <p>Please keep this tab open to keep the server running.<br>
        The frontend will open automatically in 3 seconds.<br>
        If not, click the button below.</p>
        <a href="https://zippy-cart-frontend.onrender.com" target="_blank">Go to Frontend</a>
      </div>
      <script>
        // Automatically open frontend after 3 seconds
        setTimeout(() => {
          window.open("https://zippy-cart-frontend.onrender.com", "_blank");
        }, 3000);
      </script>
    </body>
    </html>
  `);
});

app.use("/api/user", userRouter); // register and login
app.use("/api/cart",  cartRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/items", itemrouter); // cretae, get, and delete products from admin panel
app.use("/api/orders", orderRouter);

//here calling the connect db function
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
  });
});

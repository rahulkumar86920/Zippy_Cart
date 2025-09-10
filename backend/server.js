import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";

import userRouter from "./routes/user.routes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import itemrouter from "./routes/product.routes.js";
const app = express();

// port number where our server is going to run
const PORT = 8080 || process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middle ware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.send("Api is working");
});

app.use("/api/user", userRouter); // register and login
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/items",itemrouter)

//here calling the connect db function
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
  });
});

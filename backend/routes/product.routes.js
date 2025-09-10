import express from "express";
import multer from "multer";
import {
  createProducts,
  deleteProduct,
  getProducts,
} from "../controllers/product.controller.js";

const itemrouter= express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/"); // save to uploads folder
  },

  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // rename file
  },
});

const upload = multer({ storage });

// Routes
itemrouter.get("/", getProducts);
itemrouter.post("/", upload.single("image"), createProducts);
itemrouter.delete("/:id", deleteProduct);

export default itemrouter;

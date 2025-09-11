import productModel from "../models/product.model.js";

export const getProducts = async (req, res, next) => {
  try {
    // facth the products
    const products = await productModel.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// create the products
export const createProducts = async (req, res, next) => { 
  try {
     // Multer gives: req.file.filename and req.file.path
    const fileName = req.file?.filename ?? null; // ✅ lowercase 'filename'
    const image = fileName ? `/uploads/${fileName}` : null;

    const { name, price, oldPrice, category, description } = req.body;

    const product = await productModel.create({
      name,
      description,
      oldPrice: Number(oldPrice),
      price: Number(price),
      category,
      image,
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// delete a product by id
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: "product deleted successfully" });
  } catch (error) {
    next(error);
  }
};



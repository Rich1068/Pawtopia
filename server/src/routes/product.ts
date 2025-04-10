import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  getCategory,
  getList,
  getProduct,
  recoverProduct,
  softDeleteProduct,
  uploadImage,
} from "../controllers/productController";
import tokenAuth from "../middlewares/tokenAuth";
import uploadFile from "../helpers/image";
import adminAuth from "../middlewares/adminAuth";

const product = express.Router();

product.get("/get-categories", getCategory);
product.post(
  "/upload-images",
  adminAuth,
  uploadFile("product_pic").array("images", 5),
  uploadImage
);
product.post("/add-product", adminAuth, addProduct);
product.get("/list", tokenAuth, getList);
product.get("/get-products", getAllProduct);
product.get("/:id", getProduct);
product.put("/:id", adminAuth, editProduct);
product.delete("/:id", adminAuth, deleteProduct);
product.patch("/:id/soft-delete", adminAuth, softDeleteProduct);
product.patch("/:id/recover", adminAuth, recoverProduct);
export default product;

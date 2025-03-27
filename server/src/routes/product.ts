import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  getCategory,
  getList,
  getProduct,
  uploadImage,
} from "../controllers/productController";
import tokenAuth from "../middlewares/tokenAuth";
import uploadFile from "../helpers/image";

const product = express.Router();

product.get("/get-categories", getCategory);
product.post(
  "/upload-images",
  tokenAuth,
  uploadFile("product_pic").array("images", 5),
  uploadImage
);
product.post("/add-product", tokenAuth, addProduct);
product.get("/list", tokenAuth, getList);
product.get("/get-products", getAllProduct);
product.get("/:id", getProduct);
product.put("/:id", tokenAuth, editProduct);
product.delete("/:id", tokenAuth, deleteProduct);
export default product;

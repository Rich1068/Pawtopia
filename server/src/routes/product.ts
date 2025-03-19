import express from "express";
import {
  addProduct,
  deleteProduct,
  getCategory,
  getList,
  uploadImage,
} from "../controllers/productController";
import tokenAuth from "../middlewares/tokenAuth";
import uploadFile from "../helpers/image";

const product = express.Router();

product.get("/get-categories", tokenAuth, getCategory);
product.post(
  "/upload-images",
  tokenAuth,
  uploadFile("product_pic").array("images", 5),
  uploadImage
);
product.post("/add-product", tokenAuth, addProduct);
product.get("/list", tokenAuth, getList);
product.delete("/:id", tokenAuth, deleteProduct);
export default product;

import { Response, Request } from "express";
import Product from "../models/Product";
import path from "path";
import fs from "fs";
import {
  checkDuplicateProduct,
  deleteRemovedImages,
  sanitizeProductData,
  validateProductData,
} from "../helpers/productValidation";

export const getCategory = async (req: Request, res: Response) => {
  const categories = await Product.distinct("category"); // Fetch unique categories
  res.json(categories);
};

export const uploadImage = (req: Request, res: Response): void => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }

  res.json({
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  });
  return;
};

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData = sanitizeProductData(req.body);
    const validation = validateProductData(productData);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const duplicateError = await checkDuplicateProduct(productData.name);
    if (duplicateError) {
      res.status(409).json({ error: duplicateError });
      return;
    }

    const newProduct = await Product.create(productData);
    res
      .status(201)
      .json({ message: "Successfully added a product", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
      categories = "",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (categories) {
      const categoryArray = (categories as string).split(",");
      query.category = { $in: categoryArray };
    }

    const total = await Product.countDocuments(query);

    const productList = await Product.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      data: productList,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("Error fetching product list:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().exec();
    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error retrieving product", error);
    res.status(500).json({
      error: "Something went wrong, please contact the developer",
    });
  }
};
export const getProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId).exec();
    if (!product) {
      res.status(404).json({ error: "Product does not exist" });
      return;
    }
    res.status(200).json({ data: product });
  } catch (error) {
    console.error("Error retrieving product", error);
    res.status(500).json({
      error: "Something went wrong, please contact the developer",
    });
  }
};
export const editProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const productData = sanitizeProductData(req.body);
    deleteRemovedImages(req.body.oldImages, productData.images);

    const validation = validateProductData(productData);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const duplicateError = await checkDuplicateProduct(
      productData.name,
      productId
    );
    if (duplicateError) {
      res.status(409).json({ error: duplicateError });
      return;
    }

    Object.assign(product, productData);
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).exec();

    if (!product) {
      res.status(404).json({ error: "Product does not exist" });
      return;
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((imagePath: string) => {
        const fullPath = path.join(__dirname, "../../src", imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.warn("Failed to delete image:", fullPath, err.message);
          }
        });
      });
    }

    await Product.findByIdAndDelete(productId).exec();
    res.status(200).json({ message: "Product successfully deleted" });
    return;
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      error: "Something went wrong, please contact the developer",
    });
    return;
  }
};
export default { getCategory, uploadImage, getList };

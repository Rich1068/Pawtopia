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

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.id;
  const imagePaths = (req.files as Express.Multer.File[]).map((file) =>
    file.path.replace(/^src/, "")
  );

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    product.images.push(...imagePaths);
    await product.save();

    res
      .status(200)
      .json({ message: "Images uploaded", images: product.images });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
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

export const editProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const productData = sanitizeProductData(req.body);

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

    // Save old images before overwriting
    const oldImages = [...product.images];

    // Update the product
    Object.assign(product, productData);
    await product.save();

    // ✅ Now safely delete removed images after update success
    deleteRemovedImages(oldImages, productData.images);

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const { categories, status } = req.query;

    const filter: any = {};
    if (status === "available") {
      filter.isArchived = false;
    } else if (status === "archived") {
      filter.isArchived = true;
    }
    if (categories) {
      const categoryArray = (categories as string).split(",");
      filter.category = { $in: categoryArray };
    }

    const products = await Product.find(filter);
    res.status(200).json({ data: products });
    return;
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

export const recoverProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).exec();

    if (!product) {
      res.status(404).json({ error: "Product does not exist" });
      return;
    }
    if (!product.isArchived) {
      res.status(400).json({ error: "Product is not Archived" });
      return;
    }
    await Product.findByIdAndUpdate(
      productId,
      { isArchived: false },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Product successfully recovered" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
export const softDeleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).exec();

    if (!product) {
      res.status(404).json({ error: "Product does not exist" });
      return;
    }
    if (product.isArchived) {
      res.status(400).json({ error: "Product already archived" });
      return;
    }
    await Product.findByIdAndUpdate(
      productId,
      { isArchived: true },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "Product successfully archived" });
    return;
  } catch (error) {
    console.error("Error soft deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
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

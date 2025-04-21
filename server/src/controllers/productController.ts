import { Response, Request } from "express";
import Product from "../models/Product";
import {
  checkDuplicateProduct,
  deleteRemovedImages,
  sanitizeProductData,
  validateProductData,
} from "../helpers/productValidation";
import Cart from "../models/Cart";
import Order from "../models/Order";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";
import { extractPublicIdFromUrl } from "../helpers/productValidation";

export const getCategory = async (req: Request, res: Response) => {
  const categories = await Product.distinct("category"); // Fetch unique categories
  res.json(categories);
};

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.id;

  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    res.status(400).json({ error: "No images uploaded" });
    return;
  }

  try {
    const uploadPromises = (req.files as Express.Multer.File[]).map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "product_images",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
    );

    const results = await Promise.all(uploadPromises);

    const imageUrls = results.map((result: any) => result.secure_url);

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    product.images.push(...imageUrls);

    await product.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      images: product.images,
    });
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

    const oldImages = [...product.images];

    Object.assign(product, productData);
    await product.save();

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

    const products = await Product.find(filter).sort({ isArchived: 1 });
    res.status(200).json({ data: products });
    return;
  } catch (error) {
    console.error("Error fetching product list:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ isArchived: 1 }).exec();
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
      for (const image of product.images) {
        const publicId = extractPublicIdFromUrl(image);

        try {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(`Successfully deleted image: ${publicId}`, result);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.warn(
              "Failed to delete image from Cloudinary:",
              publicId,
              err.message
            );
          } else {
            // Handle the case when the error is not of type `Error`
            console.warn("An unknown error occurred:", publicId, err);
          }
        }
      }
    }

    await Cart.updateMany(
      { "products.productId": productId },
      { $set: { "products.$[elem].productId": null } },
      { arrayFilters: [{ "elem.productId": productId }] }
    );

    await Order.updateMany(
      { "products.productId": productId },
      { $set: { "products.$[elem].productId": null } },
      {
        arrayFilters: [{ "elem.productId": productId }],
      }
    );
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

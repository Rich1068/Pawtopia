import path from "path";
import fs from "fs";
import Product from "../models/Product";

export const sanitizeProductData = (data: any) => {
  const { name, category, description, price, images } = data;
  return {
    name: name?.trim(),
    category: category?.map((cat: string) => cat.trim()) || [],
    description: description?.trim(),
    price: price !== undefined ? parseFloat(price) : null,
    images: images?.map((img: string) => img.replace(/^src/, "")) || [],
  };
};

export const validateProductData = (data: any) => {
  const { name, category, description, price, images } = data;
  if (!name || !category.length || !description || !price || !images.length) {
    return { valid: false, error: "All fields are required" };
  }
  if (isNaN(price) || price <= 0) {
    return { valid: false, error: "Invalid price" };
  }
  return { valid: true };
};

export const checkDuplicateProduct = async (
  name: string,
  excludeId?: string
) => {
  const query: any = { name };
  if (excludeId) query._id = { $ne: excludeId };
  const productExists = await Product.findOne(query);
  return productExists ? "Product with this name already exists" : null;
};

export const deleteRemovedImages = (
  oldImages: string[],
  newImages: string[]
) => {
  const removedImages = oldImages.filter((img) => !newImages.includes(img));
  removedImages.forEach((image) => {
    const imagePath = path.join(
      __dirname,
      "../../src/assets/img/product_pic",
      path.basename(image)
    );
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting image:", err);
    });
  });
};

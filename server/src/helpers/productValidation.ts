import Product from "../models/Product";
import cloudinary from "../utils/cloudinary";

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
  const { name, category, description, price } = data;
  if (!name || !category.length || !description || !price) {
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

export const deleteRemovedImages = async (
  oldImages: string[],
  newImages: string[]
) => {
  const removedImages = oldImages.filter((img) => !newImages.includes(img));

  for (const image of removedImages) {
    const publicId = extractPublicIdFromUrl(image);

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`Successfully deleted image: ${publicId}`, result);
    } catch (err) {
      console.error("Error deleting image from Cloudinary:", err);
    }
  }
};

export const extractPublicIdFromUrl = (url: string): string => {
  const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[^/.]+$/;
  const match = url.match(regex);
  return match ? match[1] : "";
};

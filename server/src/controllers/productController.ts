import { Response, Request } from "express";
import Product from "../models/Product";

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
    const { name, categories, description, price, images } = req.body;

    if (!name || !categories || !description || !price || !images) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const trimmedName = name.trim();
    const sanitizedCategories = categories.map((cat: string) => cat.trim());
    const sanitizedDescription = description.trim();
    const sanitizedPrice = parseFloat(price);

    if (isNaN(sanitizedPrice) || sanitizedPrice <= 0) {
      res.status(400).json({ error: "Invalid price" });
      return;
    }

    const productExists = await Product.findOne({ name: trimmedName });
    if (productExists) {
      res.status(409).json({ error: "Product already exists" });
      return;
    }

    const newProduct = await Product.create({
      name: trimmedName,
      category: sanitizedCategories,
      description: sanitizedDescription,
      price: sanitizedPrice,
      images,
    });

    res
      .status(201)
      .json({ message: "Successfully added a product", product: newProduct });
    return;
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
export default { getCategory, uploadImage };

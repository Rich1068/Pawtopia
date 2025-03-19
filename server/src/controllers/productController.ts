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

    const sanitizedImages = images.map((img: string) =>
      img.replace(/^src/, "")
    );
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
      images: sanitizedImages,
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

    // Filtering by search (checks product name & description)
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
    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Fetch paginated and sorted products
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

export default { getCategory, uploadImage, getList };

import { useState } from "react";
import serverAPI from "../../helper/axios";
import InputField from "../../components/shop/Admin/AddProduct/InputField";
import TextareaField from "../../components/shop/Admin/AddProduct/TextareaField";
import CategorySelector from "../../components/shop/Admin/AddProduct/CategorySelector";
import ProductImageUpload from "../../components/shop/Admin/AddProduct/ProductImageUpload";
import toast from "react-hot-toast";

interface IAddProduct {
  name: string;
  categories: string[];
  description: string;
  price: string;
  images: string[];
}
const AddProduct = () => {
  const [product, setProduct] = useState<IAddProduct>({
    name: "",
    categories: [],
    description: "",
    price: "",
    images: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (categories: string[]) => {
    setProduct({ ...product, categories });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const requiredFields = [
      { field: product.name, message: "Product name is required." },
      { field: product.description, message: "Description is required." },
      { field: product.price, message: "Price is required." },
      {
        field: product.categories.length,
        message: "At least one category is required.",
      },
      { field: images.length, message: "At least one image is required." },
    ];

    for (const { field, message } of requiredFields) {
      if (!field) {
        toast.error(message);
        setLoading(false);
        return;
      }
    }

    if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
      toast.error("Please enter a valid price.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    images.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const imageResponse = await serverAPI.post(
        "/product/upload-images",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await serverAPI.post(
        "/product/add-product",
        {
          ...product,
          images: imageResponse.data.images,
        },
        { withCredentials: true }
      );

      toast.success("Product added successfully!");
      setProduct({
        name: "",
        categories: [],
        description: "",
        price: "",
        images: [],
      });
      setImages([]);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 font-primary text-orange-600">
        Add Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start max-lg:flex-col max-lg:gap-y-5 gap-x-10">
          <div className="flex-1 max-lg:w-full max-lg:mx-auto min-w-[300px] ml-auto p-6 bg-white rounded-xl shadow-lg">
            <InputField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter Product Name"
            />
            <TextareaField
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
            <div className="sm:flex gap-x-4">
              <div className="flex-1">
                <CategorySelector
                  selectedCategories={product.categories}
                  setSelectedCategories={handleCategoryChange}
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-2 mt-4 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-400"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add Product"}
            </button>
          </div>
          <div className=" flex-1 mr-auto max-lg:mx-auto shadow-lg rounded-2xl bg-white w-full max-w-3xl min-w-[300px]">
            <div className="p-6">
              <label className="font-primary text-amber-950 text-lg">
                Product Image
              </label>
              <ProductImageUpload onImagesSelect={setImages} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

import { useEffect, useState } from "react";
import serverAPI from "../../helper/axios";
import InputField from "../../components/shop/Admin/AddProduct/InputField";
import TextareaField from "../../components/shop/Admin/AddProduct/TextareaField";
import CategorySelector from "../../components/shop/Admin/AddProduct/CategorySelector";
import ProductImageUpload from "../../components/shop/Admin/AddProduct/ProductImageUpload";
import toast from "react-hot-toast";
import type { IAddProduct, IProductImage } from "../../types/Types";

const AddProduct = ({
  productToEdit,
  onRefresh,
}: {
  productToEdit?: IAddProduct;
  onRefresh?: () => void;
}) => {
  const [product, setProduct] = useState<IAddProduct>({
    name: productToEdit?.name || "",
    category: productToEdit?.category || [],
    description: productToEdit?.description || "",
    price: productToEdit?.price || "",
    images: productToEdit?.images || [],
  });
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState<IProductImage[]>([]);

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const existing = product.images.map((img) => ({
        preview: img,
        isNew: false,
      }));
      setProductImages(existing);
    }
  }, [product.images]);
  console.log(productImages);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = [
      { field: product.name, message: "Product name is required." },
      { field: product.description, message: "Description is required." },
      { field: product.price, message: "Price is required." },
      {
        field: productImages.length > 0 || product.images.length > 0,
        message: "At least one image is required.",
      },
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

    try {
      const newImages = productImages
        .filter((img) => img.isNew && img.file)
        .map((img) => img.file as File);
      const finalImagePaths = productImages
        .filter((img) => !img.isNew)
        .map((img) => img.preview); // for old images

      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => formData.append("images", file));

        try {
          const uploadRes = await serverAPI.post(
            "/product/upload-images",
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          finalImagePaths.push(...uploadRes.data.images);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        } catch (error: any) {
          toast.error("Error uploading images.");
          setLoading(false);
          return;
        }
      }

      if (productToEdit) {
        await serverAPI.put(
          `/product/${productToEdit._id}`,
          {
            ...product,
            images: finalImagePaths,
            oldImages: productToEdit.images,
          },
          { withCredentials: true }
        );
        toast.success("Product updated successfully!");
        onRefresh?.();
      } else {
        await serverAPI.post(
          "/product/add-product",
          { ...product, images: finalImagePaths },
          { withCredentials: true }
        );
        toast.success("Product added successfully!");
        setProduct({
          name: "",
          category: [],
          description: "",
          price: "",
          images: [],
        });
        setProductImages([]);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 font-primary text-orange-600">
        {productToEdit ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start max-lg:flex-col max-lg:gap-y-5 gap-x-10">
          <div className="flex-1 max-lg:w-full max-lg:mx-auto min-w-[300px] ml-auto p-6 bg-white rounded-xl shadow-lg">
            <InputField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="Enter Product Name"
            />
            <TextareaField
              label="Description"
              name="description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              placeholder="Enter product description"
            />
            <div className="sm:flex gap-x-4">
              <div className="flex-1">
                <CategorySelector
                  selectedCategories={product.category}
                  setSelectedCategories={(category) =>
                    setProduct({ ...product, category })
                  }
                />
              </div>
              <div className="flex-1">
                <InputField
                  label="Price"
                  name="price"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-2 mt-4 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-400"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : productToEdit
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
          <div className=" flex-1 mr-auto max-lg:mx-auto shadow-lg rounded-2xl bg-white w-full max-w-3xl min-w-[300px]">
            <div className="p-6">
              <label className="font-primary text-amber-950 text-lg">
                Product Image
              </label>
              <ProductImageUpload
                productImages={productImages}
                setProductImages={setProductImages}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

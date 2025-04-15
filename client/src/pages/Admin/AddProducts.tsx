import { useEffect, useState } from "react";
import InputField from "../../components/shop/Admin/AddProduct/InputField";
import TextareaField from "../../components/shop/Admin/AddProduct/TextareaField";
import CategorySelector from "../../components/shop/Admin/AddProduct/CategorySelector";
import ProductImageUpload from "../../components/shop/Admin/AddProduct/ProductImageUpload";
import toast from "react-hot-toast";
import type { IAddProduct, IProductImage } from "../../types/Types";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import { useAddEditMutation } from "../../hooks/useProducts";

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
  const [productImages, setProductImages] = useState<IProductImage[]>([]);
  const { mutate: addOrEditProduct, isPending } = useAddEditMutation();

  const updateProductImagesPreview = (images: string[]) => {
    const existing = images.map((img) => ({
      preview: img,
      isNew: false,
    }));
    setProductImages(existing);
  };

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      updateProductImagesPreview(product.images);
    }
  }, [product.images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        return;
      }
    }
    if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    addOrEditProduct({
      product,
      productImages,
      productToEdit,
      onSuccess: (updatedProduct) => {
        if (updatedProduct) {
          updateProductImagesPreview(updatedProduct);
        } else {
          setProduct({
            name: "",
            category: [],
            description: "",
            price: "",
            images: [],
          });
          setProductImages([]);
        }
        onRefresh?.();
      },
    });
  };

  return (
    <div>
      <TitleComponent text={productToEdit ? "Edit Product" : "Add Product"} />

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
              disabled={isPending}
            >
              {isPending
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import serverAPI from "../helper/axios";
import { IAddProduct, IProduct, IProductImage } from "../types/Types";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface UseProductsParams {
  selectedCategories?: string[];
  statusFilter?: string;
}
// ProductList.tsx
export const useProducts = ({
  selectedCategories = [],
  statusFilter = "All",
}: UseProductsParams) => {
  const queryClient = useQueryClient();

  const fetchProducts = async (): Promise<IProduct[]> => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.append("categories", selectedCategories.join(","));
    }
    if (statusFilter !== "All") {
      params.append(
        "status",
        statusFilter === "Available" ? "available" : "archived"
      );
    }

    const response = await serverAPI.get(`/product/list?${params.toString()}`, {
      withCredentials: true,
    });

    return response.data.data;
  };

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", selectedCategories, statusFilter],
    queryFn: fetchProducts,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // DELETE product
  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await serverAPI.delete(`/product/${productId}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });

  // ARCHIVE product
  const archiveMutation = useMutation({
    mutationFn: async (productId: string) => {
      await serverAPI.patch(
        `/product/${productId}/soft-delete`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to archive product.");
    },
  });

  // RECOVER product
  const recoverMutation = useMutation({
    mutationFn: async (productId: string) => {
      await serverAPI.patch(
        `/product/${productId}/recover`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to recover product.");
    },
  });

  return {
    products,
    isLoading,
    error: error ? (error as Error).message : null,
    deleteProduct: deleteMutation.mutate,
    archiveProduct: archiveMutation.mutate,
    recoverProduct: recoverMutation.mutate,
  };
};

//ViewProduct.tsx
export const useProduct = (id?: string) => {
  const query = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("No product ID provided");
      const res = await serverAPI.get(`/product/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

//Add and EditProduct.tsx
interface ProductMutationArgs {
  product: IAddProduct;
  productImages: IProductImage[];
  productToEdit?: IAddProduct;
  onSuccess?: (updatedProduct?: string[]) => void;
}

export const useAddEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      product,
      productImages,
      productToEdit,
    }: ProductMutationArgs) => {
      const newImages = productImages
        .filter((img) => img.isNew && img.file)
        .map((img) => img.file as File);

      const finalImagePaths = productImages
        .filter((img) => !img.isNew)
        .map((img) => img.preview);

      if (productToEdit) {
        const updateRes = await serverAPI.put(
          `/product/${productToEdit._id}`,
          {
            ...product,
            images: finalImagePaths,
            oldImages: productToEdit.images,
          },
          { withCredentials: true }
        );

        if (newImages.length > 0) {
          const formData = new FormData();
          newImages.forEach((file) => formData.append("images", file));
          const updateImages = await serverAPI.post(
            `/product/${productToEdit._id}/upload-images`,
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          toast.success("Product updated successfully!");
          console.log(updateImages.data.images);
          return updateImages.data.images;
        }

        toast.success("Product updated successfully!");
        return updateRes.data.product.images;
      }

      const createRes = await serverAPI.post(
        "/product/add-product",
        { ...product, images: [] },
        { withCredentials: true }
      );

      const newProduct = createRes.data.product;

      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => formData.append("images", file));
        formData.append("productId", newProduct._id);

        await serverAPI.post(
          `/product/${newProduct._id}/upload-images`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      toast.success("Product added successfully!");
      return newProduct.images;
    },
    onSuccess: (updatedProduct, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      variables.onSuccess?.(updatedProduct as string[]);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Product mutation failed:", error);
      toast.error(error.response?.data?.error || "Something went wrong.");
    },
  });
};

//Shop.tsx
export const useShopList = () => {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/product/get-products");
      return data.data as IProduct[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
  useEffect(() => {
    if (query.isError) {
      toast.error("An error occurred while fetching products.");
    }
  }, [query.isError]);
  return {
    ...query,
  };
};

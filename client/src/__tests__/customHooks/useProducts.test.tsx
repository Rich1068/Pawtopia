import { waitFor, renderHook, act } from "@testing-library/react";
import {
  useAddEditMutation,
  useProduct,
  useProductMutations,
  useProducts,
  useShopList,
} from "../../hooks/useProducts";
import serverAPI from "../../helper/axios";
import toast from "react-hot-toast";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import { mockProducts, mockProduct } from "../../__mocks__/mockProducts";

// Mock serverAPI
jest.mock("../../helper/axios");
jest.mock("react-hot-toast");

const mockedAPI = serverAPI as jest.Mocked<typeof serverAPI>;

describe("useProductMutations", () => {
  it("should delete a product successfully", async () => {
    const productId = "123";
    mockedAPI.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useProductMutations(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.deleteProduct.mutate(productId);
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Product deleted successfully."
      )
    );
    expect(serverAPI.delete).toHaveBeenCalledWith(`/product/${productId}`, {
      withCredentials: true,
    });
  });

  it("should handle error when deleting a product", async () => {
    const productId = "123";
    mockedAPI.delete.mockRejectedValueOnce({
      response: { data: { error: "Product not found" } },
    });

    const { result } = renderHook(() => useProductMutations(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.deleteProduct.mutate(productId);
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Product not found")
    );
    expect(serverAPI.delete).toHaveBeenCalledWith(`/product/${productId}`, {
      withCredentials: true,
    });
  });

  it("should archive a product successfully", async () => {
    const productId = "123";
    mockedAPI.patch.mockResolvedValueOnce({});

    const { result } = renderHook(() => useProductMutations(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.archiveProduct.mutate(productId);
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Product archived successfully."
      )
    );
    expect(mockedAPI.patch).toHaveBeenCalledWith(
      `/product/${productId}/soft-delete`,
      {},
      { withCredentials: true }
    );
  });

  it("should handle error when archiving a product", async () => {
    const productId = "123";
    mockedAPI.patch.mockRejectedValueOnce({
      response: { data: { error: "Failed to archive product" } },
    });

    const { result } = renderHook(() => useProductMutations(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.archiveProduct.mutate(productId);
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to archive product")
    );
    expect(mockedAPI.patch).toHaveBeenCalledWith(
      `/product/${productId}/soft-delete`,
      {},
      { withCredentials: true }
    );
  });

  it("should recover a product successfully", async () => {
    const productId = "123";
    mockedAPI.patch.mockResolvedValueOnce({});

    const { result } = renderHook(() => useProductMutations(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.recoverProduct.mutate(productId);
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Product recovered successfully."
      )
    );
    expect(mockedAPI.patch).toHaveBeenCalledWith(
      `/product/${productId}/recover`,
      {},
      { withCredentials: true }
    );
  });

  it("should handle error when recovering a product", async () => {
    const productId = "123";
    mockedAPI.patch.mockRejectedValueOnce({
      response: { data: { error: "Failed to recover product" } },
    });

    const { result } = renderHook(() => useProductMutations(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.recoverProduct.mutate(productId);
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to recover product")
    );
    expect(serverAPI.patch).toHaveBeenCalledWith(
      `/product/${productId}/recover`,
      {},
      { withCredentials: true }
    );
  });
});
describe("useProducts hook", () => {
  it("should fetch products with correct params", async () => {
    mockedAPI.get.mockResolvedValueOnce({
      data: { data: mockProducts },
    });

    const { result } = renderHook(
      () =>
        useProducts({
          selectedCategories: ["toys"],
          statusFilter: "Available",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    // Wait for data to be fetched
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
    expect(mockedAPI.get).toHaveBeenCalledWith(
      expect.stringContaining("/product/list?categories=toys&status=available"),
      { withCredentials: true }
    );
  });

  it("should return empty array and error message on failure", async () => {
    mockedAPI.get.mockRejectedValueOnce({
      response: {
        data: { error: "Failed to fetch" },
      },
    });

    const { result } = renderHook(() => useProducts({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(undefined);
  });
});
describe("useProduct hook", () => {
  it("fetches a product successfully when ID is provided", async () => {
    mockedAPI.get.mockResolvedValueOnce({
      data: { data: mockProduct },
    });

    const { result } = renderHook(() => useProduct("123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockProduct);
    expect(mockedAPI.get).toHaveBeenCalledWith("/product/123");
  });

  it("does not fetch if no ID is provided", async () => {
    const { result } = renderHook(() => useProduct(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("returns an error if API call fails", async () => {
    mockedAPI.get.mockRejectedValueOnce({
      response: { data: { error: "Product not found" } },
    });

    const { result } = renderHook(() => useProduct("invalid-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(mockedAPI.get).toHaveBeenCalledWith("/product/invalid-id");
  });
});

describe("useAddEditMutation", () => {
  const mockFile = new File(["test image content"], "test.jpg", {
    type: "image/jpeg",
  });

  const mockProductData = {
    name: "Test Product",
    price: "99.99",
    description: "Test description",
    category: ["test-category"],
    images: [],
  };

  const productToEdit = {
    _id: "product-123",
    name: "Original Product",
    price: "50",
    description: "Original description",
    category: ["original-category"],
    images: ["existing-image.jpg"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new product successfully", async () => {
    // Mock API responses
    mockedAPI.post.mockImplementation((url) => {
      if (url === "/product/add-product") {
        return Promise.resolve({
          data: {
            product: { _id: "new-product-123" },
          },
        });
      }
      return Promise.resolve({});
    });

    const mockOnSuccess = jest.fn();
    const productImages = [
      { isNew: true, file: mockFile, preview: "blob:test" },
    ];

    const { result } = renderHook(() => useAddEditMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        product: mockProductData,
        productImages,
        onSuccess: mockOnSuccess,
      });
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Product added successfully!")
    );

    expect(mockedAPI.post).toHaveBeenCalledWith(
      "/product/add-product",
      { ...mockProductData, images: [] },
      { withCredentials: true }
    );

    expect(mockedAPI.post).toHaveBeenCalledWith(
      expect.stringContaining("/product/"),
      expect.any(FormData),
      expect.objectContaining({
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("should update an existing product successfully with new images", async () => {
    // Mock API responses
    const updatedImages = ["updated-image1.jpg", "updated-image2.jpg"];
    mockedAPI.put.mockResolvedValueOnce({
      data: {
        product: {
          _id: "product-123",
          images: ["existing-image.jpg"],
        },
      },
    });
    mockedAPI.post.mockResolvedValueOnce({
      data: {
        images: updatedImages,
      },
    });

    const mockOnSuccess = jest.fn();

    const productImages = [
      { isNew: false, preview: "existing-image.jpg" },
      { isNew: true, file: mockFile, preview: "blob:new-image" },
    ];

    const { result } = renderHook(() => useAddEditMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        product: mockProductData,
        productImages,
        productToEdit,
        onSuccess: mockOnSuccess,
      });
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Product updated successfully!"
      )
    );

    expect(mockedAPI.put).toHaveBeenCalledWith(
      `/product/${productToEdit._id}`,
      {
        ...mockProductData,
        images: ["existing-image.jpg"],
        oldImages: ["existing-image.jpg"],
      },
      { withCredentials: true }
    );

    expect(mockedAPI.post).toHaveBeenCalledWith(
      `/product/${productToEdit._id}/upload-images`,
      expect.any(FormData),
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    expect(mockOnSuccess).toHaveBeenCalledWith(updatedImages);
  });

  it("should update an existing product successfully without new images", async () => {
    // Mock API responses
    const existingImages = ["existing-image.jpg"];
    mockedAPI.put.mockResolvedValueOnce({
      data: {
        product: {
          _id: "product-123",
          images: existingImages,
        },
      },
    });

    const mockOnSuccess = jest.fn();

    const productImages = [{ isNew: false, preview: "existing-image.jpg" }];

    const { result } = renderHook(() => useAddEditMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        product: mockProductData,
        productImages,
        productToEdit,
        onSuccess: mockOnSuccess,
      });
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Product updated successfully!"
      )
    );

    expect(mockedAPI.put).toHaveBeenCalledWith(
      `/product/${productToEdit._id}`,
      {
        ...mockProductData,
        images: existingImages,
        oldImages: existingImages,
      },
      { withCredentials: true }
    );

    // Verify post was not called since there are no new images
    expect(mockedAPI.post).not.toHaveBeenCalledWith(
      `/product/${productToEdit._id}/upload-images`,
      expect.any(FormData),
      expect.any(Object)
    );

    expect(mockOnSuccess).toHaveBeenCalledWith(existingImages);
  });

  it("should handle error when creating a product", async () => {
    // Mock API error
    mockedAPI.post.mockRejectedValueOnce({
      response: {
        data: {
          error: "Failed to create product",
        },
      },
    });

    const mockOnSuccess = jest.fn();
    const productImages: never[] = [];

    const { result } = renderHook(() => useAddEditMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        product: mockProductData,
        productImages,
        onSuccess: mockOnSuccess,
      });
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to create product")
    );

    expect(mockedAPI.post).toHaveBeenCalledWith(
      "/product/add-product",
      expect.objectContaining({ ...mockProductData }),
      { withCredentials: true }
    );

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("should handle error when updating a product", async () => {
    // Mock API error
    mockedAPI.put.mockRejectedValueOnce({
      response: {
        data: {
          error: "Failed to update product",
        },
      },
    });

    const mockOnSuccess = jest.fn();

    const productImages = [{ isNew: false, preview: "existing-image.jpg" }];

    const { result } = renderHook(() => useAddEditMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        product: mockProductData,
        productImages,
        productToEdit,
        onSuccess: mockOnSuccess,
      });
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to update product")
    );

    expect(mockedAPI.put).toHaveBeenCalledWith(
      `/product/${productToEdit._id}`,
      expect.any(Object),
      { withCredentials: true }
    );

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("should handle error when uploading images", async () => {
    // Mock API responses - product update succeeds but image upload fails
    mockedAPI.put.mockResolvedValueOnce({
      data: {
        product: {
          _id: "product-123",
          images: ["existing-image.jpg"],
        },
      },
    });
    mockedAPI.post.mockRejectedValueOnce({
      response: {
        data: {
          error: "Failed to upload images",
        },
      },
    });

    const mockOnSuccess = jest.fn();

    const productImages = [
      { isNew: false, preview: "existing-image.jpg" },
      { isNew: true, file: mockFile, preview: "blob:new-image" },
    ];

    const { result } = renderHook(() => useAddEditMutation(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        product: mockProductData,
        productImages,
        productToEdit,
        onSuccess: mockOnSuccess,
      });
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to upload images")
    );

    expect(mockedAPI.put).toHaveBeenCalled();
    expect(mockedAPI.post).toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});

describe("useShopList", () => {
  it("returns data when the fetch is successful", async () => {
    mockedAPI.get.mockResolvedValueOnce({
      data: { data: mockProducts },
    });

    const { result } = renderHook(() => useShopList(), {
      wrapper: createWrapper(),
    });

    // Wait until the query is done loading
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProducts);
    expect(mockedAPI.get).toHaveBeenCalledWith("/product/get-products");
  });

  it("shows error toast when fetch fails", async () => {
    mockedAPI.get.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useShopList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred while fetching products."
    );
  });
});

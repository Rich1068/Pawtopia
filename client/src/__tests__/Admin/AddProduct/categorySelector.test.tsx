import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CategorySelector from "../../../components/shop/Admin/AddProduct/CategorySelector";
import serverAPI from "../../../helper/axios";

jest.mock("../../../helper/axios", () => ({
  get: jest.fn(),
}));

describe("CategorySelector Component", () => {
  const mockCategories = [
    "Dog Food",
    "Cat Toys",
    "Pet Grooming",
    "Fish Supplies",
  ];
  const mockSetSelectedCategories = jest.fn();

  const renderCategorySelector = (selectedCategories: string[] = []) => {
    return render(
      <CategorySelector
        selectedCategories={selectedCategories}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );
  };

  const openDropdown = async () => {
    fireEvent.click(screen.getByText("▼"));
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter new category")).toBeVisible();
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: mockCategories,
    });
  });

  it("should render and fetch categories on mount", async () => {
    renderCategorySelector();

    expect(screen.getByText("Category")).toBeVisible();
    expect(screen.getByText("Select or add categories")).toBeVisible();

    expect(serverAPI.get).toHaveBeenCalledWith("/product/get-categories", {
      withCredentials: true,
    });
    await openDropdown();
    mockCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeVisible();
    });
  });

  it("should handle selecting categories", async () => {
    renderCategorySelector();
    await openDropdown();
    fireEvent.click(screen.getByText("Dog Food"));
    expect(mockSetSelectedCategories).toHaveBeenCalledWith(["Dog Food"]);
  });

  it("should display selected categories as tags", () => {
    renderCategorySelector(["Cat Toys"]);
    const categoryTag = screen.getByText("Cat Toys");
    expect(categoryTag).toBeVisible();
    expect(categoryTag.closest("span")).toHaveClass("bg-orange-400");
  });

  it("should allow removing selected categories", () => {
    renderCategorySelector(["Pet Grooming"]);
    fireEvent.click(screen.getByText("✕"));
    expect(mockSetSelectedCategories).toHaveBeenCalledWith([]);
  });

  it("should allow adding new categories", async () => {
    renderCategorySelector();
    await openDropdown();
    await userEvent.type(
      screen.getByPlaceholderText("Enter new category"),
      "Bird Cages"
    );
    fireEvent.click(screen.getByText("Add Category"));

    expect(mockSetSelectedCategories).toHaveBeenCalledWith(["Bird Cages"]);
  });

  it("should handle dropdown toggle and outside clicks", async () => {
    renderCategorySelector();
    await openDropdown();
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Enter new category")
      ).not.toBeInTheDocument();
    });
    await openDropdown();
    fireEvent.click(screen.getByText("▲"));
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText("Enter new category")
      ).not.toBeInTheDocument();
    });
  });

  it("should not add duplicate categories to selection", async () => {
    renderCategorySelector(["Fish Supplies"]);
    await openDropdown();

    fireEvent.click(screen.getByRole("button", { name: "Fish Supplies" }));
    expect(mockSetSelectedCategories).not.toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();
    (serverAPI.get as jest.Mock).mockRejectedValue(new Error("API error"));

    renderCategorySelector();
    await openDropdown();
    expect(console.error).toHaveBeenCalledWith(
      "Failed to fetch categories:",
      expect.any(Error)
    );
    expect(screen.getByText("No Categories")).toBeVisible();

    console.error = originalConsoleError;
  });
});

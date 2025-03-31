import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategorySelector from "../../../components/shop/Admin/AddProduct/CategorySelector";
import { useCategories } from "../../../hooks/useCategories";
import "@testing-library/jest-dom";

jest.mock("../../../hooks/useCategories");

const mockUseCategories = useCategories as jest.MockedFunction<
  typeof useCategories
>;

describe("CategorySelector Component", () => {
  let setSelectedCategories: jest.Mock;

  beforeEach(() => {
    setSelectedCategories = jest.fn();
    mockUseCategories.mockReturnValue({
      categories: ["Category1", "Category2"],
      setCategories: jest.fn(),
      loading: false,
      error: null,
    });
  });

  test("renders correctly with default state", () => {
    render(
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    expect(screen.getByText("Select or add categories")).toBeInTheDocument();
  });

  test("displays existing categories when dropdown is open", () => {
    render(
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByText("Select or add categories"));

    expect(screen.getByText("Category1")).toBeInTheDocument();
    expect(screen.getByText("Category2")).toBeInTheDocument();
  });

  test("selects a category when clicked", () => {
    render(
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    fireEvent.click(screen.getByText("Select or add categories")); // Open dropdown
    fireEvent.click(screen.getByText("Category1")); // Select category

    expect(setSelectedCategories).toHaveBeenCalledWith(["Category1"]);
  });

  test("removes a selected category when remove button is clicked", () => {
    render(
      <CategorySelector
        selectedCategories={["Category1"]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    fireEvent.click(screen.getByText("✕")); // Click remove button

    expect(setSelectedCategories).toHaveBeenCalledWith([]);
  });

  test("adds a new category", async () => {
    const setCategories = jest.fn();
    mockUseCategories.mockReturnValue({
      categories: ["Category1"],
      setCategories,
      loading: false,
      error: null,
    });

    render(
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    fireEvent.click(screen.getByText("Select or add categories")); // Open dropdown
    fireEvent.change(screen.getByPlaceholderText("Enter new category"), {
      target: { value: "NewCategory" },
    });

    fireEvent.click(screen.getByText("Add Category")); // Click Add Category button

    await waitFor(() => {
      expect(setCategories).toHaveBeenCalledWith(["Category1", "NewCategory"]); // Ensure new category is added
      expect(setSelectedCategories).toHaveBeenCalledWith(["NewCategory"]); // Ensure category is selected
    });
  });

  test("handles loading state", () => {
    mockUseCategories.mockReturnValue({
      categories: [],
      setCategories: jest.fn(),
      loading: true,
      error: null,
    });

    render(
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    fireEvent.click(screen.getByText("Select or add categories"));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("handles error state", () => {
    mockUseCategories.mockReturnValue({
      categories: [],
      setCategories: jest.fn(),
      loading: false,
      error: "Failed to load categories",
    });

    render(
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    fireEvent.click(screen.getByText("Select or add categories"));
    expect(screen.getByText("Failed to load categories")).toBeInTheDocument();
  });

  test("toggles dropdown when clicked", () => {
    render(
      <CategorySelector
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    const dropdownButton = screen.getByText("Select or add categories");

    // Open dropdown
    fireEvent.click(dropdownButton);
    expect(screen.getByText("Category1")).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(dropdownButton);
    expect(screen.queryByText("Category1")).not.toBeInTheDocument();
  });
});

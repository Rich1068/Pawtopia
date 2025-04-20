import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useCategories } from "../../../hooks/useCategories";
import CategorySelector from "../../../components/shop/Admin/AddProduct/CategorySelector";
import "@testing-library/jest-dom";

jest.mock("../../../hooks/useCategories");

const mockedUseCategories = useCategories as jest.Mock;

const mockSetSelectedCategories = jest.fn();

const renderComponent = (selectedCategories: string[] = []) => {
  render(
    <CategorySelector
      selectedCategories={selectedCategories}
      setSelectedCategories={mockSetSelectedCategories}
    />
  );
};

describe("CategorySelector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockedUseCategories.mockReturnValue({
      categories: [],
      loading: true,
      error: null,
    });

    renderComponent();

    fireEvent.click(screen.getByText(/select or add categories/i));
    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("renders error state", () => {
    mockedUseCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: "Failed to fetch",
    });

    renderComponent();

    fireEvent.click(screen.getByText(/select or add categories/i));
    expect(screen.getByText("Failed to fetch")).toBeVisible();
  });

  it("shows available categories in dropdown", async () => {
    mockedUseCategories.mockReturnValue({
      categories: ["Dogs", "Cats"],
      loading: false,
      error: null,
    });

    renderComponent();

    fireEvent.click(screen.getByText(/select or add categories/i));
    expect(screen.getByText("Dogs")).toBeVisible();
    expect(screen.getByText("Cats")).toBeVisible();
  });

  it("selects a category", async () => {
    mockedUseCategories.mockReturnValue({
      categories: ["Dogs"],
      loading: false,
      error: null,
    });

    renderComponent();

    fireEvent.click(screen.getByText(/select or add categories/i));
    fireEvent.click(screen.getByText("Dogs"));

    expect(mockSetSelectedCategories).toHaveBeenCalledWith(["Dogs"]);
  });

  it("removes a selected category", () => {
    mockedUseCategories.mockReturnValue({
      categories: ["Dogs"],
      loading: false,
      error: null,
    });

    renderComponent(["Dogs"]);

    const removeButton = screen.getByText("✕");
    fireEvent.click(removeButton);

    expect(mockSetSelectedCategories).toHaveBeenCalledWith([]);
  });

  it("adds a new category and selects it", async () => {
    mockedUseCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: null,
    });

    renderComponent();

    fireEvent.click(screen.getByText(/select or add categories/i));

    const input = screen.getByPlaceholderText("Enter new category");
    fireEvent.change(input, { target: { value: "birds" } });

    const addButton = screen.getByText("Add Category");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockSetSelectedCategories).toHaveBeenCalledWith(["Birds"]);
    });
  });

  it("does not add duplicate categories", async () => {
    mockedUseCategories.mockReturnValue({
      categories: ["Birds"],
      loading: false,
      error: null,
    });

    renderComponent(["Birds"]);

    fireEvent.click(screen.getByText(/birds/i)); // open dropdown
    const input = screen.getByPlaceholderText("Enter new category");

    fireEvent.change(input, { target: { value: "birds" } });
    fireEvent.click(screen.getByText("Add Category"));

    expect(mockSetSelectedCategories).toHaveBeenCalledTimes(0);
  });

  it("toggles dropdown open/close", () => {
    mockedUseCategories.mockReturnValue({
      categories: ["Birds"],
      loading: false,
      error: null,
    });

    renderComponent();

    const toggleButton = screen.getByText("▼");
    fireEvent.click(toggleButton);
    expect(screen.getByText("Birds")).toBeVisible();

    fireEvent.click(screen.getByText("▲"));
    expect(screen.queryByText("Birds")).not.toBeInTheDocument();
  });
});

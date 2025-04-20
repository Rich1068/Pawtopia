import { render, fireEvent, screen } from "@testing-library/react";
import CategoryFilter from "../../../components/shop/Admin/ProductList/CategoryFilter";
import { useCategories } from "../../../hooks/useCategories";
import "@testing-library/jest-dom";

jest.mock("../../../hooks/useCategories", () => ({
  useCategories: jest.fn(),
}));

describe("CategoryFilter", () => {
  const mockCategories = ["Dog", "Cat", "Rabbit"];

  beforeEach(() => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
    });
  });

  it("renders placeholder when no category is selected", () => {
    render(
      <CategoryFilter
        selectedCategories={[]}
        setSelectedCategories={jest.fn()}
      />
    );
    expect(screen.getByText("Select categories...")).toBeVisible();
  });

  it("displays selected categories with remove buttons", () => {
    render(
      <CategoryFilter
        selectedCategories={["Dog"]}
        setSelectedCategories={jest.fn()}
      />
    );
    expect(screen.getByText("Dog")).toBeVisible();
    expect(screen.getByRole("button")).toBeVisible();
  });

  it("opens dropdown and allows selecting a category", () => {
    const setSelectedCategories = jest.fn();

    render(
      <CategoryFilter
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByText("Select categories..."));

    // Click on "Cat" checkbox
    const catCheckbox = screen.getByLabelText("Cat");
    fireEvent.click(catCheckbox);

    expect(setSelectedCategories).toHaveBeenCalledWith(["Cat"]);
  });

  it("removes category when X is clicked", () => {
    const setSelectedCategories = jest.fn();

    render(
      <CategoryFilter
        selectedCategories={["Dog"]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    // Find and click the X button
    const removeButton = screen.getByRole("button");
    fireEvent.click(removeButton);

    expect(setSelectedCategories).toHaveBeenCalledWith([]);
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <>
        <CategoryFilter
          selectedCategories={[]}
          setSelectedCategories={jest.fn()}
        />
        <div data-testid="outside">Outside</div>
      </>
    );

    fireEvent.click(screen.getByText("Select categories..."));
    expect(screen.getByText("Cat")).toBeVisible();

    fireEvent.mouseDown(screen.getByTestId("outside"));

    expect(screen.queryByText("Cat")).not.toBeInTheDocument();
  });
});

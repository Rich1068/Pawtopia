import { render, screen, fireEvent } from "@testing-library/react";
import AdminButtons from "../../components/shop/ViewProduct/AdminButtons";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

jest.mock("lucide-react", () => ({
  Trash: () => <svg data-testid="trash-icon" />,
}));

describe("AdminButtons", () => {
  const mockSetIsModalOpen = jest.fn();
  const mockProductId = "123";

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AdminButtons
          productId={mockProductId}
          setIsModalOpen={mockSetIsModalOpen}
        />
      </MemoryRouter>
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
    renderComponent();
  });

  const getElements = () => ({
    editButton: screen.getByText("Edit Product"),
    deleteButton: screen.getByTestId("trash-icon").closest("button"),
    editLink: screen.getByText("Edit Product").closest("a"),
  });

  it("renders both buttons with correct properties", () => {
    const { editButton, deleteButton, editLink } = getElements();

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/admin/product/edit/123");
  });

  it("triggers modal open when delete button is clicked", () => {
    fireEvent.click(getElements().deleteButton!);
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(true);
  });
});

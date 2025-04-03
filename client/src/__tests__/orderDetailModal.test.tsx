import { fireEvent, render, screen } from "@testing-library/react";
import OrderDetailsModal from "../components/OrderHistory/OrderDetailModal";
import { IOrder } from "../types/Types";
import "@testing-library/jest-dom";

// Mock react-modal
jest.mock("react-modal", () => ({
  __esModule: true,
  default: jest.fn(({ children, isOpen }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null
  ),
}));
const mockOrder: IOrder = {
  orderId: "ORD123",
  createdAt: "2023-05-15T10:30:00Z",
  userId: "1",
  totalAmount: 99.99,
  products: [
    {
      productId: "1",
      name: "Test Product 1",
      price: 29.99,
      quantity: 2,
    },
    {
      productId: "2",
      name: "Test Product 2",
      price: 39.99,
      quantity: 1,
    },
  ],
};
describe("OrderDetailsModal", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    order: mockOrder,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when order is null", () => {
    const { container } = render(
      <OrderDetailsModal {...mockProps} order={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal with order details when open", () => {
    render(<OrderDetailsModal {...mockProps} />);

    expect(screen.getByTestId("modal")).toBeVisible();
    expect(screen.getByText("Order Details")).toBeVisible();
    expect(screen.getByText("ORD123")).toBeVisible();
    expect(screen.getByText("5/15/2023")).toBeVisible(); // Date format may vary by locale
    expect(screen.getByText("$99.99")).toBeVisible();
  });

  it("displays all products in the order", () => {
    render(<OrderDetailsModal {...mockProps} />);

    expect(screen.getByText("Test Product 1")).toBeVisible();
    expect(screen.getByText("$29.99 x 2")).toBeVisible();
    expect(screen.getByText("Test Product 2")).toBeVisible();
    expect(screen.getByText("$39.99 x 1")).toBeVisible();
  });

  it("calls onClose when close button is clicked", () => {
    render(<OrderDetailsModal {...mockProps} />);

    fireEvent.click(screen.getByText("Close"));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <OrderDetailsModal {...mockProps} isOpen={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});

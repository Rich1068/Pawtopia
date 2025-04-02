import { render, screen, fireEvent } from "@testing-library/react";
import UserButtons from "../../components/shop/ViewProduct/UserButtons";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { MemoryRouter, useNavigate } from "react-router";
import { mockProduct } from "../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

jest.mock("../../context/CartContext");
jest.mock("../../context/AuthContext");
jest.mock(
  "../../components/WarningModal",
  () =>
    ({
      isModalOpen,
      setIsModalOpen,
      onConfirm,
    }: {
      isModalOpen: boolean;
      setIsModalOpen: (arg: boolean) => void;
      onConfirm: () => void;
    }) =>
      isModalOpen && (
        <div data-testid="warning-modal">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      )
);

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

const mockAddToCart = jest.fn();
const mockNavigate = jest.fn();

describe("UserButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({ addToCart: mockAddToCart });
    (useAuth as jest.Mock).mockReturnValue({ user: null });
  });

  const renderComponent = (userLoggedIn = false) => {
    (useAuth as jest.Mock).mockReturnValue({
      user: userLoggedIn ? { id: "user1" } : null,
    });

    return render(
      <MemoryRouter>
        <UserButtons product={mockProduct} />
      </MemoryRouter>
    );
  };

  it("renders quantity controls and buttons", () => {
    renderComponent();

    expect(screen.getByText("Quantity:")).toBeVisible();
    expect(screen.getByDisplayValue("1")).toBeVisible();
    expect(screen.getByText("-")).toBeVisible();
    expect(screen.getByText("+")).toBeVisible();
    expect(screen.getByText("Buy Now")).toBeVisible();
    expect(screen.getByText("Add to Cart")).toBeVisible();
  });

  it("increases quantity when + button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByDisplayValue("2")).toBeVisible();
  });

  it("decreases quantity when - button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("+")); // Increase to 2 first
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByDisplayValue("1")).toBeVisible();
  });

  it("does not decrease below 1", () => {
    renderComponent();
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByDisplayValue("1")).toBeVisible();
  });

  it("updates quantity via input field", () => {
    renderComponent();
    const input = screen.getByDisplayValue("1");
    fireEvent.change(input, { target: { value: "5" } });
    expect(screen.getByDisplayValue("5")).toBeVisible();
  });

  it("increases quantity correctly with handleIncrease", () => {
    renderComponent();
    const input = screen.getByDisplayValue("1");

    fireEvent.change(input, { target: { value: "98" } });
    fireEvent.click(screen.getByText("+"));
    expect(input).toHaveValue("99");

    fireEvent.click(screen.getByText("+"));
    expect(input).toHaveValue("99");
  });

  it("sets quantity to 1 when input is invalid", () => {
    renderComponent();
    const input = screen.getByDisplayValue("1");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(screen.getByDisplayValue("1")).toBeVisible();
  });

  it("sets quantity to 1 when input is empty", () => {
    renderComponent();
    const input = screen.getByDisplayValue("1");
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByDisplayValue("1")).toBeVisible();
  });

  describe("when user is not logged in", () => {
    it("shows warning modal when Buy Now is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Buy Now"));
      expect(screen.getByTestId("warning-modal")).toBeVisible();
    });

    it("shows warning modal when Add to Cart is clicked", () => {
      renderComponent();
      fireEvent.click(screen.getByText("Add to Cart"));
      expect(screen.getByTestId("warning-modal")).toBeVisible();
    });

    it("navigates to login when modal is confirmed", () => {
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      renderComponent();
      fireEvent.click(screen.getByText("Buy Now"));
      fireEvent.click(screen.getByText("Confirm"));
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("when user is logged in", () => {
    it("calls addToCart and navigates to checkout on Buy Now", () => {
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      renderComponent(true);
      fireEvent.click(screen.getByText("Buy Now"));
      expect(mockAddToCart).toHaveBeenCalledWith("1", 1);
      expect(mockNavigate).toHaveBeenCalledWith("/shop/checkout");
    });

    it("calls addToCart on Add to Cart", () => {
      renderComponent(true);
      fireEvent.click(screen.getByText("Add to Cart"));
      expect(mockAddToCart).toHaveBeenCalledWith("1", 1);
    });

    it("uses current quantity when adding to cart", () => {
      renderComponent(true);
      fireEvent.click(screen.getByText("+")); // quantity = 2
      fireEvent.click(screen.getByText("Buy Now"));
      expect(mockAddToCart).toHaveBeenCalledWith("1", 2);
    });
  });
});

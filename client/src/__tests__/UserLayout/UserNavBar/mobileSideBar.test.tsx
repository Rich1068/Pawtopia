import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MobileSidebar, {
  IMobileSidebar,
} from "../../../components/Layout/User/NavBarComponents/MobileSideBar";
import { useCart } from "../../../context/CartContext";
import "@testing-library/jest-dom";
import { mockUser } from "../../../__mocks__/mockUser";
import { mockFavorites } from "../../../__mocks__/mockFavorites";

jest.mock("../../../context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  __esModule: true,
  X: () => <div data-testid="icon-X" />,
  LogOut: () => <div data-testid="icon-LogOut" />,
  UserRound: () => <div data-testid="icon-UserRound" />,
  Home: () => <div data-testid="icon-Home" />,
  ShoppingCart: () => <div data-testid="icon-ShoppingCart" />,
  Heart: () => <div data-testid="icon-Heart" />,
  Mail: () => <div data-testid="icon-Mail" />,
  ShoppingBag: () => <div data-testid="icon-ShoppingBag" />,
  PawPrint: () => <div data-testid="icon-PawPrint" />,
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  NavLink: jest.fn(
    ({ children, to, className, onClick, "data-testid": testId }) => {
      const isActive = to === "/"; // Simulate the "Home" link as active
      return (
        <a
          href={to}
          className={className?.({ isActive })}
          onClick={onClick}
          data-testid={testId}
        >
          {children}
        </a>
      );
    }
  ),
}));

describe("MobileSidebar Component", () => {
  const mockHandleClose = jest.fn();
  const mockLogout = jest.fn();

  const defaultProps: IMobileSidebar = {
    isOpen: true,
    closing: false,
    handleClose: mockHandleClose,
    user: mockUser || null,
    logout: mockLogout,
    favorites: mockFavorites,
    navItems: [
      { name: "Home", path: "/", testId: "home" },
      { name: "Shop", path: "/shop", testId: "shop" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCart as jest.Mock).mockReturnValue({
      cart: {
        products: [
          { _id: "1", productId: { name: "Product 1" }, quantity: 2 },
          { _id: "2", productId: { name: "Product 2" }, quantity: 1 },
        ],
      },
    });
  });

  const renderComponent = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <MobileSidebar {...props} />
      </MemoryRouter>
    );
  };

  it("renders the sidebar when isOpen is true", () => {
    renderComponent();

    expect(screen.getByTestId("mobile-sidebar")).toBeVisible();
    expect(screen.getByText("John")).toBeVisible();
    expect(screen.getByAltText("Profile")).toHaveAttribute(
      "src",
      "/default-profile.jpg"
    );
  });

  it("does not render the sidebar when isOpen is false", () => {
    renderComponent({ ...defaultProps, isOpen: false });

    expect(screen.queryByTestId("mobile-sidebar")).not.toBeInTheDocument();
  });

  it("displays the correct count for Favorites and Cart", () => {
    renderComponent();

    expect(screen.getByText("Favorites")).toBeVisible();
    expect(screen.getAllByText("(2)")[0]).toBeVisible(); // Favorites count

    expect(screen.getByText("Cart")).toBeVisible();
    expect(screen.getAllByText("(2)")[1]).toBeVisible(); // Cart count (2 + 1)
  });

  it("applies the correct className for active and inactive NavLinks", () => {
    renderComponent();

    const homeLink = screen.getByTestId("home-nav");
    expect(homeLink).toHaveClass("bg-orange-300/25 text-orange-600"); // Active class

    const shopLink = screen.getByTestId("shop-nav");
    expect(shopLink).toHaveClass("hover:bg-orange-50 text-amber-950"); // Inactive class
  });

  it("calls handleClose when a NavLink is clicked", () => {
    renderComponent();

    const homeLink = screen.getByTestId("home-nav");
    fireEvent.click(homeLink);

    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("calls logout and handleClose when the Logout button is clicked", () => {
    renderComponent();

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("renders Login and Register links when the user is not logged in", () => {
    renderComponent({ ...defaultProps, user: null });

    expect(screen.getByText("Login")).toBeVisible();
    expect(screen.getByText("Register")).toBeVisible();
  });

  it("renders Favorites and Cart links with no counts when empty", () => {
    renderComponent({
      ...defaultProps,
      favorites: [],
    });

    expect(screen.getByText("Favorites")).toBeVisible();
    expect(screen.queryByText("(0)")).not.toBeInTheDocument(); // No count displayed for empty Favorites

    expect(screen.getByText("Cart")).toBeVisible();
    expect(screen.queryByText("(0)")).not.toBeInTheDocument(); // No count displayed for empty Cart
  });
});

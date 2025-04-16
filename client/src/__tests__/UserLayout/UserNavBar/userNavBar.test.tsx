import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserNavBar from "../../../components/Layout/User/UserNavBar";
import { useAuth } from "../../../context/AuthContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { useCart } from "../../../context/CartContext";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { createWrapper } from "../../../__mocks__/utils/testUtils";

const wrapper = createWrapper();

const renderComponent = () => {
  return render(
    wrapper({
      children: (
        <MemoryRouter>
          <UserNavBar />
        </MemoryRouter>
      ),
    })
  );
};
jest.mock("../../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../../context/FavoritesContext", () => ({
  useFavorites: jest.fn(),
}));

jest.mock("../../../context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock(
  "../../../components/Layout/User/NavBarComponents/MobileSideBar",
  () => ({
    __esModule: true,
    default: ({
      isOpen,
      handleClose,
    }: {
      isOpen: boolean;
      handleClose: () => void;
    }) => (
      <div data-testid="mobile-sidebar" className={isOpen ? "open" : "closed"}>
        {isOpen && (
          <button data-testid="mobile-sidebar-close" onClick={handleClose}>
            Close Mobile Menu
          </button>
        )}
      </div>
    ),
  })
);

jest.mock(
  "../../../components/Layout/User/NavBarComponents/NavigationLinks",
  () => ({
    __esModule: true,
    default: ({
      navItems,
    }: {
      navItems: Array<{ name: string; path: string }>;
    }) => (
      <nav>
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            data-testid={`navlink-${item.name}`}
          >
            {item.name}
          </a>
        ))}
      </nav>
    ),
  })
);

describe("UserNavBar Component", () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseFavorites = useFavorites as jest.Mock;
  const mockUseCart = useCart as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFavorites.mockReturnValue({ favorites: [] });
    mockUseCart.mockReturnValue({ cart: [] });
  });

  it("renders correctly for logged-out users", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      loading: false,
    });

    renderComponent();

    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.getByTestId("login-nav")).toBeVisible();
    expect(screen.getByTestId("register-nav")).toBeVisible();
    expect(screen.getByRole("button")).toBeVisible();
  });

  it("renders correctly for logged-in users", () => {
    mockUseAuth.mockReturnValue({
      user: { name: "John Doe" },
      logout: jest.fn(),
      loading: false,
    });

    renderComponent();

    expect(screen.getByRole("banner")).toBeVisible();
    expect(screen.queryByTestId("login-nav")).not.toBeInTheDocument();
    expect(screen.queryByTestId("register-nav")).not.toBeInTheDocument();

    expect(screen.getByTestId("icon-ShoppingCart")).toBeVisible();
    expect(screen.getByTestId("icon-Heart")).toBeVisible();
    expect(screen.getByTestId("icon-lucide-user-round")).toBeVisible();
  });

  it("renders nothing when loading is true", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      loading: true,
    });

    renderComponent();

    expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  });

  it("renders navigation links correctly", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      loading: false,
    });

    renderComponent();

    expect(screen.getByTestId("navlink-Home")).toBeVisible();
    expect(screen.getByTestId("navlink-Shop")).toBeVisible();
    expect(screen.getByTestId("navlink-Adopt")).toBeVisible();
    expect(screen.getByTestId("navlink-Contact")).toBeVisible();
  });

  it("closes the sidebar through the X in the sidebar", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      loading: false,
    });

    renderComponent();

    const menuButton = screen.getByTestId("icon-Menu");
    fireEvent.click(menuButton);

    expect(screen.getByTestId("mobile-sidebar")).toHaveClass("open");
    expect(screen.getByTestId("mobile-sidebar-close")).toBeVisible();

    fireEvent.click(screen.getByTestId("mobile-sidebar-close"));

    await waitFor(() => {
      expect(screen.getByTestId("mobile-sidebar")).toHaveClass("closed");
      expect(
        screen.queryByTestId("mobile-sidebar-close")
      ).not.toBeInTheDocument();
    });
  });

  it("closes the sidebar through the X in the navbar", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      logout: jest.fn(),
      loading: false,
    });

    renderComponent();

    const menuButton = screen.getByTestId("icon-Menu");
    fireEvent.click(menuButton);

    expect(screen.getByTestId("mobile-sidebar")).toHaveClass("open");
    expect(screen.getByTestId("mobile-sidebar-close")).toBeVisible();

    fireEvent.click(screen.getByTestId("icon-X"));

    await waitFor(() => {
      expect(screen.getByTestId("mobile-sidebar")).toHaveClass("closed");
      expect(
        screen.queryByTestId("mobile-sidebar-close")
      ).not.toBeInTheDocument();
    });
  });
});

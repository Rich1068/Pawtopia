import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AdminSidebar from "../../../components/Layout/Admin/AdminSideBar";
import "@testing-library/jest-dom";

const mockLocation = {
  pathname: "/admin/dashboard",
};

// Mock react-router components and hooks
jest.mock("react-router", () => {
  const originalModule = jest.requireActual("react-router");

  return {
    ...originalModule,
    NavLink: ({
      children,
      to,
      className,
    }: {
      children: React.ReactNode;
      to: string;
      className?: string | ((props: { isActive: boolean }) => string);
    }) => {
      const isActive = mockLocation.pathname === to;
      const resolvedClassName =
        typeof className === "function" ? className({ isActive }) : className;
      return (
        <a
          href={to}
          className={resolvedClassName}
          data-testid={`navlink-${to.replace(/\//g, "-").slice(1)}`}
        >
          {children}
        </a>
      );
    },
    useLocation: () => mockLocation,
  };
});

describe("AdminSidebar Component", () => {
  const mockSetIsExpanded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (isExpanded: boolean) => {
    return render(
      <MemoryRouter>
        <AdminSidebar
          isExpanded={isExpanded}
          setIsExpanded={mockSetIsExpanded}
        />
      </MemoryRouter>
    );
  };

  it("renders correctly when isExpanded is true", () => {
    renderComponent(true);

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toBeVisible();
    expect(sidebar).toHaveClass("w-60 translate-x-0 opacity-100");

    expect(screen.getByText("Dashboard")).toBeVisible();

    expect(screen.getByText("Store")).toBeVisible();

    expect(screen.getByText("Adopt")).toBeVisible();
  });

  it("renders correctly when isExpanded is false", () => {
    renderComponent(false);

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toBeVisible();
    expect(sidebar).toHaveClass(
      "w-20 -translate-x-full opacity-0 sm:opacity-100 md:translate-x-0"
    );

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

    expect(screen.queryByText("Store")).not.toBeInTheDocument();

    expect(screen.queryByText("Adopt")).not.toBeInTheDocument();
  });

  it("toggles the Store dropdown when clicked", () => {
    renderComponent(true);

    expect(screen.queryByText("Add Product")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Store"));

    expect(screen.getByText("Add Product")).toBeVisible();
    expect(screen.getByText("Product List")).toBeVisible();
    expect(screen.getByText("Orders")).toBeVisible();

    fireEvent.click(screen.getByText("Store"));

    expect(screen.queryByText("Add Product")).not.toBeInTheDocument();
  });

  it("expands the sidebar when clicking the Store button while collapsed", () => {
    renderComponent(false);

    fireEvent.click(screen.getByTestId("icon-Store"));

    expect(mockSetIsExpanded).toHaveBeenCalledTimes(1);
    expect(mockSetIsExpanded).toHaveBeenCalledWith(true);
  });
  it("applies active styles to the correct link", () => {
    mockLocation.pathname = "/admin/product-list";
    renderComponent(true);
    fireEvent.click(screen.getByTestId("Store-button"));
    const productListLink = screen.getByText("Product List");
    fireEvent.click(productListLink);
    expect(productListLink).toHaveClass("text-orange-600");
    expect(productListLink).toHaveClass("hover:bg-orange-50");

    const addProductLink = screen.getByText("Add Product");
    expect(addProductLink).not.toHaveClass("text-orange-600");
    expect(addProductLink).toHaveClass("hover:bg-orange-50");
  });

  it("renders non-dropdown navigation items correctly", () => {
    // Set location for this test
    mockLocation.pathname = "/admin/dashboard";

    renderComponent(true);

    const dashboardLink = screen.getByText("Dashboard");
    expect(dashboardLink).toBeVisible();

    expect(dashboardLink.closest("a")).toHaveClass("bg-orange-300/25");
    expect(dashboardLink.closest("a")).toHaveClass("text-orange-600");

    const adoptLink = screen.getByText("Adopt");
    expect(adoptLink).toBeVisible();
    expect(adoptLink.closest("a")).not.toHaveClass("bg-orange-300/25");
    expect(adoptLink.closest("a")).not.toHaveClass("text-orange-600");
    expect(adoptLink.closest("a")).toHaveClass("hover:bg-orange-50");
  });
});

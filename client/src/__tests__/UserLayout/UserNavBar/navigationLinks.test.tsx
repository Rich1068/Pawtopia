import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NavigationLinks from "../../../components/Layout/User/NavBarComponents/NavigationLinks";
import "@testing-library/jest-dom";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  NavLink: jest.fn(({ children, to, className, "data-testid": testId }) => {
    const isActive = to === "/";
    return (
      <a href={to} className={className?.({ isActive })} data-testid={testId}>
        {children}
      </a>
    );
  }),
}));

describe("NavigationLinks Component", () => {
  const navItems = [
    { name: "Home", path: "/", testId: "home" },
    { name: "Shop", path: "/shop", testId: "shop" },
    { name: "Contact", path: "/contact", testId: "contact" },
  ];

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <NavigationLinks navItems={navItems} />
      </MemoryRouter>
    );
  };

  it("renders all navigation links", () => {
    renderComponent();

    // Assert that all navigation links are rendered
    navItems.forEach(({ name, testId }) => {
      const link = screen.getByTestId(`${testId}-nav`);
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent(name);
    });
  });

  it("applies the correct class for active and inactive links", () => {
    renderComponent();

    // Assert that the "Home" link has the active class
    const homeLink = screen.getByTestId("home-nav");
    expect(homeLink).toHaveClass("text-orange-500");

    // Assert that the "Shop" and "Contact" links have the inactive class
    const shopLink = screen.getByTestId("shop-nav");
    const contactLink = screen.getByTestId("contact-nav");
    expect(shopLink).not.toHaveClass("text-orange-500");
    expect(contactLink).not.toHaveClass("text-orange-500");
  });
});

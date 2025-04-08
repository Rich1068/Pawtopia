import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import UserFooter from "../../components/Layout/User/UserFooter";
import "@testing-library/jest-dom";

jest.mock("../../components/Logo", () => ({
  __esModule: true,
  default: ({ style }: { style: string }) => (
    <div data-testid="logo" className={style}>
      Logo
    </div>
  ),
}));

describe("UserFooter Component", () => {
  const renderComponent = (pathname: string) => {
    return render(
      <MemoryRouter initialEntries={[pathname]}>
        <UserFooter />
      </MemoryRouter>
    );
  };

  it("renders the footer correctly", () => {
    renderComponent("/");

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeVisible();

    expect(screen.getByTestId("logo")).toBeVisible();

    expect(
      screen.getByText("© 2025 Pawtopia All rights reserved.")
    ).toBeVisible();
  });

  it("renders all navigation links", () => {
    renderComponent("/");

    expect(screen.getByTestId("home-footer")).toBeVisible();
    expect(screen.getByTestId("shop-footer")).toBeVisible();
    expect(screen.getByTestId("adopt-footer")).toBeVisible();
    expect(screen.getByTestId("contact-footer")).toBeVisible();
  });

  it("applies active styles to the correct link", () => {
    renderComponent("/shop");

    const shopLink = screen.getByTestId("shop-footer");
    expect(shopLink).toHaveClass("text-orange-500");

    const homeLink = screen.getByTestId("home-footer");
    expect(homeLink).not.toHaveClass("text-orange-500");
  });

  it("renders separators between navigation links", () => {
    renderComponent("/");

    const separators = screen.getAllByText("|");
    expect(separators).toHaveLength(3);
  });
});

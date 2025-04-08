import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import UserLayout from "../../components/Layout/UserLayout";
import "@testing-library/jest-dom";

jest.mock("../../components/Layout/User/UserNavBar", () => ({
  __esModule: true,
  default: () => <div data-testid="user-navbar">UserNavBar</div>,
}));

jest.mock("../../components/Layout/User/UserFooter", () => ({
  __esModule: true,
  default: () => <div data-testid="user-footer">UserFooter</div>,
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

describe("UserLayout Component", () => {
  it("renders UserNavBar, Outlet, and UserFooter", () => {
    render(
      <MemoryRouter>
        <UserLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId("user-navbar")).toBeVisible();

    expect(screen.getByTestId("outlet")).toBeVisible();
    expect(screen.getByTestId("outlet")).toHaveTextContent("Outlet Content");

    expect(screen.getByTestId("user-footer")).toBeVisible();
  });
});

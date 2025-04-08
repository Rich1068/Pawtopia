import { render, screen, fireEvent } from "@testing-library/react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

jest.mock("../../../components/Layout/Admin/AdminNavBar", () => ({
  __esModule: true,
  default: ({
    isExpanded,
    setIsExpanded,
  }: {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
  }) => (
    <div data-testid="admin-navbar">
      {`NavBar Expanded: ${isExpanded}`}
      <button onClick={() => setIsExpanded(!isExpanded)}>Toggle</button>
    </div>
  ),
}));

jest.mock("../../../components/Layout/Admin/AdminSideBar", () => ({
  __esModule: true,
  default: ({ isExpanded }: { isExpanded: boolean }) => (
    <div data-testid="admin-sidebar">{`SideBar Expanded: ${isExpanded}`}</div>
  ),
}));

jest.mock("../../../components/Layout/Admin/AdminFooter", () => ({
  __esModule: true,
  default: ({ isExpanded }: { isExpanded: boolean }) => (
    <div data-testid="admin-footer">{`Footer Expanded: ${isExpanded}`}</div>
  ),
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <AdminLayout />
    </MemoryRouter>
  );
};

// Helper function to assert the isExpanded state
const assertIsExpandedState = (isExpanded: boolean) => {
  expect(screen.getByTestId("admin-navbar")).toHaveTextContent(
    `NavBar Expanded: ${isExpanded}`
  );
  expect(screen.getByTestId("admin-sidebar")).toHaveTextContent(
    `SideBar Expanded: ${isExpanded}`
  );
  expect(screen.getByTestId("admin-footer")).toHaveTextContent(
    `Footer Expanded: ${isExpanded}`
  );
};

describe("AdminLayout Component", () => {
  it("renders all child components with initial state", () => {
    renderComponent();

    assertIsExpandedState(true);

    expect(screen.getByTestId("outlet")).toHaveTextContent("Outlet Content");
  });

  it("toggles isExpanded state and updates layout", () => {
    renderComponent();

    assertIsExpandedState(true);

    fireEvent.click(screen.getByText("Toggle"));

    assertIsExpandedState(false);
  });

  it("renders with collapsed state when isExpanded is toggled", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Toggle"));

    assertIsExpandedState(false);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import AdminNavBar from "../../../components/Layout/Admin/AdminNavBar";
import "@testing-library/jest-dom";

// Mock child components
jest.mock("../../../components/Logo", () => ({
  __esModule: true,
  default: () => <div data-testid="logo">Logo</div>,
}));

jest.mock("lucide-react");

jest.mock(
  "../../../components/Layout/User/NavBarComponents/ProfileDropdown",
  () => ({
    __esModule: true,
    default: () => <div data-testid="profile-dropdown">ProfileDropdown</div>,
  })
);

describe("AdminNavBar Component", () => {
  const mockSetIsExpanded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the navigation bar correctly", () => {
    render(<AdminNavBar isExpanded={true} setIsExpanded={mockSetIsExpanded} />);

    const navBar = screen.getByRole("navigation");
    expect(navBar).toBeVisible();

    expect(screen.getByTestId("logo")).toBeVisible();

    expect(screen.getByTestId("profile-dropdown")).toBeVisible();
  });

  it("calls setIsExpanded when the toggle button is clicked", () => {
    render(<AdminNavBar isExpanded={true} setIsExpanded={mockSetIsExpanded} />);

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    expect(mockSetIsExpanded).toHaveBeenCalledTimes(1);
    expect(mockSetIsExpanded).toHaveBeenCalledWith(false);
  });

  it("renders the mobile logo when screen size is small", () => {
    render(<AdminNavBar isExpanded={true} setIsExpanded={mockSetIsExpanded} />);

    const mobileLogo = screen.getByAltText("logo");
    expect(mobileLogo).toBeVisible();
    expect(mobileLogo).toHaveAttribute("src", "/assets/img/Logo1.png");
  });
});

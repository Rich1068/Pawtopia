import { render, screen, fireEvent } from "@testing-library/react";
import ProfileDropdown from "../../../components/Layout/User/NavBarComponents/ProfileDropdown";
import { useAuth } from "../../../context/AuthContext";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

jest.mock("../../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("ProfileDropdown Component", () => {
  const mockLogout = jest.fn();
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    profileImage: "/profile.jpg",
    role: "user",
  };

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <ProfileDropdown />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
  });

  it("renders the profile dropdown button", () => {
    renderComponent();

    const profileButton = screen.getByRole("button");
    expect(profileButton).toBeInTheDocument();

    const profileImage = screen.getByAltText("Profile");
    expect(profileImage).toHaveAttribute("src", "/profile.jpg");
  });

  it("toggles the dropdown visibility when the button is clicked", () => {
    renderComponent();

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("displays user information (name and email) in the dropdown", () => {
    renderComponent();

    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders admin dashboard link if the user is an admin", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { ...mockUser, role: "admin" },
      logout: mockLogout,
    });

    renderComponent();

    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("does not render admin dashboard link if the user is not an admin", () => {
    renderComponent();

    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("calls logout and closes the dropdown when the logout button is clicked", () => {
    renderComponent();

    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("closes the dropdown when clicking outside", () => {
    renderComponent();

    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    fireEvent.mouseDown(document);

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("closes the dropdown when a link is clicked", () => {
    renderComponent();

    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    const profileLink = screen.getByText("Profile");

    fireEvent.click(profileLink);

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("closes the dropdown when the 'Dashboard' link is clicked", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { ...mockUser, role: "admin" },
      logout: mockLogout,
    });

    renderComponent();

    // Open the dropdown
    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    // Assert that the dropdown is visible
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Click the "Dashboard" link
    const dashboardLink = screen.getByText("Dashboard");
    fireEvent.click(dashboardLink);

    // Assert that the dropdown is closed
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("closes the dropdown when the 'Order History' link is clicked", () => {
    renderComponent();

    // Open the dropdown
    const profileButton = screen.getByRole("button");
    fireEvent.click(profileButton);

    // Assert that the dropdown is visible
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Click the "Order History" link
    const orderHistoryLink = screen.getByText("Order History");
    fireEvent.click(orderHistoryLink);

    // Assert that the dropdown is closed
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });
});

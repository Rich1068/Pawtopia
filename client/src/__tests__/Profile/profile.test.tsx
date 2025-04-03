import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import Profile from "../../pages/Profile";
import ProfileCard from "../../components/Profile/ProfileCard";
import ProfileImageCard from "../../components/Profile/ProfileImageCard";
import PageHeader from "../../components/PageHeader";
import "@testing-library/jest-dom";

// Mock the components and context
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

jest.mock("../../components/Profile/ProfileCard");
jest.mock("../../components/Profile/ProfileImageCard");
jest.mock("../../components/PageHeader");

describe("Profile Component", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "avatar.jpg",
  };

  beforeEach(() => {
    // Mock child components
    (ProfileCard as jest.Mock).mockImplementation(() => <div>ProfileCard</div>);
    (ProfileImageCard as jest.Mock).mockImplementation(() => (
      <div>ProfileImageCard</div>
    ));
    (PageHeader as jest.Mock).mockImplementation(() => <div>PageHeader</div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when user is not available", () => {
    (useContext as jest.Mock).mockReturnValue({ user: null });

    const { container } = render(<Profile />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders profile components when user is available", () => {
    (useContext as jest.Mock).mockReturnValue({ user: mockUser });

    render(<Profile />);

    expect(screen.getByText("PageHeader")).toBeVisible();
    expect(screen.getByText("ProfileImageCard")).toBeVisible();
    expect(screen.getByText("ProfileCard")).toBeVisible();
  });

  it("passes user data to child components", () => {
    (useContext as jest.Mock).mockReturnValue({ user: mockUser });

    render(<Profile />);

    expect(ProfileImageCard).toHaveBeenCalledWith(
      { user: mockUser },
      undefined
    );
    expect(ProfileCard).toHaveBeenCalledWith({ user: mockUser }, undefined);
  });

  it("applies correct layout classes", () => {
    (useContext as jest.Mock).mockReturnValue({ user: mockUser });

    const { container } = render(<Profile />);
    const mainDiv = container.querySelector("div > div");

    expect(mainDiv).toHaveClass("min-w-full");
    expect(mainDiv).toHaveClass("min-h-screen");

    const contentDiv = container.querySelector(".flex");
    expect(contentDiv).toHaveClass("items-start");
    expect(contentDiv).toHaveClass("flex-wrap");
    expect(contentDiv).toHaveClass("max-lg:flex-col");
    expect(contentDiv).toHaveClass("content-center");
  });
});

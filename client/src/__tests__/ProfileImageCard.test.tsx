import { render, screen } from "@testing-library/react";
import ProfileImageCard from "../components/Profile/ProfileImageCard";
import { User } from "../types/Types";
import "@testing-library/jest-dom";

const renderProfileImageCard = (user: User = mockUser) => {
  return render(<ProfileImageCard user={user} />);
};
jest.mock("lucide-react", () => ({
  UserRound: () => <svg data-testid="lucide-user-round" />,
  Pencil: () => <svg data-testid="lucide-pencil" />,
}));
const mockUser: User = {
  _id: "1",
  name: "Bob",
  role: "user",
  profileImage: "https://example.com/image.jpg",
  email: "bob@gmail.com",
  phoneNumber: "9017654897",
  createdAt: new Date(),
};

describe("ProfileImageCard Unit Test", () => {
  it("displays username and role", () => {
    renderProfileImageCard();

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("user")).toBeInTheDocument();
  });
  it("displays profile image if available", () => {
    renderProfileImageCard();

    const profileImage = screen.getByAltText("Profile");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src", mockUser.profileImage);
  });
  it("displays placeholder icon when image is missing", () => {
    const userWithoutImage: User = { ...mockUser, profileImage: "" };
    renderProfileImageCard(userWithoutImage);
    expect(screen.getByTestId("lucide-user-round")).toBeInTheDocument();
  });
});

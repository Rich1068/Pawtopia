import { fireEvent, render, screen } from "@testing-library/react";
import ProfileImageCard from "../components/Profile/ProfileImageCard";
import { User } from "../types/Types";
import "@testing-library/jest-dom";
import React from "react";

jest.mock("../context/AuthContext", () => ({
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
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
jest.spyOn(React, "useContext").mockReturnValue({
  user: mockUser,
  isAuthenticated: true,
  loading: false,
  verifyToken: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
});

const renderProfileImageCard = (user: User = mockUser) => {
  return render(<ProfileImageCard user={user} />);
};

describe("ProfileImageCard Unit Test", () => {
  it("displays username and role", () => {
    renderProfileImageCard();
    expect(screen.getByText("Bob")).toBeVisible();
    expect(screen.getByText("user")).toBeVisible();
  });
  it("displays profile image if available", () => {
    renderProfileImageCard();

    const profileImage = screen.getByAltText("Profile");
    expect(profileImage).toBeVisible();
    expect(profileImage).toHaveAttribute("src", mockUser.profileImage);
  });
  it("opens modal on edit button click", () => {
    renderProfileImageCard();
    const editButton = screen.getByTestId("edit-profileImage-button");
    expect(editButton).toBeVisible();
    fireEvent.click(editButton);
  });
  it("displays placeholder icon when image is missing", () => {
    const userWithoutImage: User = { ...mockUser, profileImage: "" };
    renderProfileImageCard(userWithoutImage);
    expect(screen.getByTestId("lucide-user-round")).toBeVisible();
  });
});

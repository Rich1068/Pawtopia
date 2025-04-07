import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileImageCard from "../../components/Profile/ProfileImageCard";
import { User } from "../../types/Types";
import serverAPI from "../../helper/axios";
import { useAuth } from "../../context/AuthContext";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("../../helper/axios");
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Create a proper mock for the ProfileImageUpload component
jest.mock("../../components/Profile/ProfileImageUpload", () => {
  return jest.fn(({ isOpen, onClose, onImageSave }) => {
    if (!isOpen) return null;

    return (
      <div data-testid="mock-image-upload-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
        <input
          type="file"
          data-testid="file-input"
          onChange={(e) => {
            if (e.target.files) {
              onImageSave(e.target.files[0]);
            }
          }}
        />
      </div>
    );
  });
});

const mockVerifyToken = jest.fn();
const mockServerPost = jest.fn();

const userWithoutImage: User = {
  _id: "123",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "user",
  profileImage: "",
  phoneNumber: "09772684567",
  createdAt: new Date(),
};

const userWithImage: User = {
  ...userWithoutImage,
  profileImage: "https://example.com/profile.jpg",
};

describe("ProfileImageCard", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ verifyToken: mockVerifyToken });
    (serverAPI.post as jest.Mock).mockImplementation(mockServerPost);
    mockServerPost.mockResolvedValue({
      data: { message: "Upload successful" },
    });
    jest.clearAllMocks();
  });

  it("renders user info correctly without profile image", () => {
    render(<ProfileImageCard user={userWithoutImage} />);

    expect(screen.getByText("Jane Doe")).toBeVisible();
    expect(screen.getByText("user")).toBeVisible();
    expect(screen.getByTestId("lucide-user-round")).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders user info correctly with profile image", () => {
    render(<ProfileImageCard user={userWithImage} />);

    expect(screen.getByText("Jane Doe")).toBeVisible();
    expect(screen.getByText("user")).toBeVisible();
    expect(screen.queryByTestId("lucide-user-round")).not.toBeInTheDocument();

    const profileImage = screen.getByRole("img");
    expect(profileImage).toBeVisible();
    expect(profileImage).toHaveAttribute("src", userWithImage.profileImage);
    expect(profileImage).toHaveAttribute("alt", "Profile");
  });

  it("shows edit button and opens modal on click", () => {
    render(<ProfileImageCard user={userWithoutImage} />);

    const editButton = screen.getByTestId("edit-profileImage-button");
    expect(editButton).toBeVisible();
    expect(
      screen.queryByTestId("mock-image-upload-modal")
    ).not.toBeInTheDocument();

    fireEvent.click(editButton);

    expect(screen.getByTestId("mock-image-upload-modal")).toBeVisible();
  });

  it("closes modal when close button is clicked", () => {
    render(<ProfileImageCard user={userWithoutImage} />);

    fireEvent.click(screen.getByTestId("edit-profileImage-button"));
    expect(screen.getByTestId("mock-image-upload-modal")).toBeVisible();

    fireEvent.click(screen.getByTestId("close-modal"));

    expect(
      screen.queryByTestId("mock-image-upload-modal")
    ).not.toBeInTheDocument();
  });

  it("uploads image and calls verifyToken on successful upload", async () => {
    const file = new File(["dummy content"], "avatar.png", {
      type: "image/png",
    });

    render(<ProfileImageCard user={userWithoutImage} />);

    fireEvent.click(screen.getByTestId("edit-profileImage-button"));

    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const formDataMatcher = expect.objectContaining({
        append: expect.any(Function),
      });

      expect(mockServerPost).toHaveBeenCalledWith(
        "/user/upload-image",
        formDataMatcher,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      expect(mockVerifyToken).toHaveBeenCalled();
    });

    expect(
      screen.queryByTestId("mock-image-upload-modal")
    ).not.toBeInTheDocument();
  });

  it("handles API error during image upload", async () => {
    const file = new File(["dummy content"], "avatar.png", {
      type: "image/png",
    });
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    mockServerPost.mockRejectedValueOnce(new Error("Upload failed"));
    render(<ProfileImageCard user={userWithoutImage} />);
    fireEvent.click(screen.getByTestId("edit-profileImage-button"));

    const fileInput = screen.getByTestId("file-input");
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Error here ",
        expect.any(Error)
      );
    });

    expect(
      screen.queryByTestId("mock-image-upload-modal")
    ).not.toBeInTheDocument();

    consoleLogSpy.mockRestore();
  });
});

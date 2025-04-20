/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProfileImageCard from "../../components/Profile/ProfileImageCard";
import { mockUser } from "../../__mocks__/mockUser";

// Declare mutate outside so we can assert against it
const mockMutate = jest.fn();

// Mocks
jest.mock("../../hooks/useProfile", () => ({
  useUploadProfileImage: () => ({
    mutate: mockMutate,
  }),
}));

jest.mock("../../components/profile/ProfileImageUpload", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onImageSave }: any) =>
    isOpen ? (
      <div data-testid="mock-profile-upload">
        Mock Modal
        <button
          onClick={() =>
            onImageSave(
              new File(["avatar"], "avatar.png", { type: "image/png" })
            )
          }
        >
          Save Image
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("lucide-react", () => ({
  UserRound: (props: any) => (
    <div data-testid="icon-UserRound" {...props}>
      MockUserIcon
    </div>
  ),
  Pencil: (props: any) => <div {...props}>MockPencilIcon</div>,
}));

describe("ProfileImageCard", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("renders user name and role", () => {
    render(<ProfileImageCard user={mockUser} />);
    expect(screen.getByText("John")).toBeVisible();
    expect(screen.getByText("user")).toBeVisible();
  });

  it("shows user icon if no profile image is provided", () => {
    render(<ProfileImageCard user={mockUser} />);
    expect(screen.getByAltText("Profile")).toBeVisible();
  });

  it("renders profile image if available", () => {
    const userWithImage = { ...mockUser, profileImage: "/test.jpg" };
    render(<ProfileImageCard user={userWithImage} />);
    const img = screen.getByAltText("Profile") as HTMLImageElement;
    expect(img).toBeVisible();
    expect(img.src).toContain("/test.jpg");
  });

  it("opens modal on pencil icon click", async () => {
    render(<ProfileImageCard user={mockUser} />);
    const editBtn = screen.getByTestId("edit-profileImage-button");
    await userEvent.click(editBtn);
    expect(screen.getByTestId("mock-profile-upload")).toBeVisible();
  });

  it("calls uploadMutation.mutate with image when image is saved", async () => {
    render(<ProfileImageCard user={mockUser} />);

    const editBtn = screen.getByTestId("edit-profileImage-button");
    await userEvent.click(editBtn);

    const saveButton = screen.getByText("Save Image");
    await userEvent.click(saveButton);

    expect(mockMutate).toHaveBeenCalledWith({
      userId: "123",
      image: expect.any(File),
    });
  });

  it("closes the modal when close button is clicked", async () => {
    render(<ProfileImageCard user={mockUser} />);
    const editBtn = screen.getByTestId("edit-profileImage-button");
    await userEvent.click(editBtn);

    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);

    expect(screen.queryByTestId("mock-profile-upload")).not.toBeInTheDocument();
  });
});

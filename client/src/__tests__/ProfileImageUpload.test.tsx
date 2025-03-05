import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileImageUpload from "../components/Profile/ProfileImageUpload";
import "@testing-library/jest-dom";

const mockOnClose = jest.fn();
const mockOnImageSave = jest.fn();
const renderProfileImageUpload = (props = {}) => {
  return render(
    <ProfileImageUpload
      isOpen={true}
      onClose={mockOnClose}
      onImageSave={mockOnImageSave}
      {...props} // Allow overriding props if needed
    />
  );
};
const uploadImage = () => {
  const mockFile = new File(["mock content"], "image.jpg", {
    type: "image/jpeg",
  });
  const input = screen.getByTestId("file-input");
  fireEvent.change(input, { target: { files: [mockFile] } });

  return mockFile; // Return the file for assertions
};
describe("ProfileImageUpload Unit Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("display the modal when isOpen is true", () => {
    renderProfileImageUpload();
    expect(screen.getByText("Upload Profile Picture")).toBeVisible()();
    expect(screen.getByText("No Image")).toBeVisible()();
  });

  it("does not display the modal when isOpen is false", () => {
    const { container } = renderProfileImageUpload({ isOpen: false });
    expect(container.innerHTML).toBe("");
  });

  it("updates preview when an image is selected", async () => {
    renderProfileImageUpload();
    uploadImage();

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeVisible()();
    });
  });

  it("Save Image on click of the save button", async () => {
    renderProfileImageUpload(true);
    const mockFile = uploadImage();
    const saveButton = screen.getByText("Save");

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
    fireEvent.click(saveButton);
    expect(mockOnImageSave).toHaveBeenCalledWith(mockFile);
  });

  it("disables save button when no image is selected", () => {
    renderProfileImageUpload(true);
    const saveButton = screen.getByText("Save");
    expect(saveButton).toBeDisabled();
  });
});

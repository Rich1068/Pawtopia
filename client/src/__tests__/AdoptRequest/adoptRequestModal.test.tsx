import { render, screen, fireEvent } from "@testing-library/react";
import AdoptRequestModal from "../../components/AdoptRequest/AdoptRequestModal";
import { IAdoptRequest } from "../../types/Types";
import "@testing-library/jest-dom";

jest.mock("lucide-react");

const mockRequest: IAdoptRequest = {
  _id: "1",
  petName: "Fluffy",
  status: "pending",
  name: "John Doe",
  email: "john@example.com",
  phone: "09772685588",
  address: "123 Main St",
  mode: "Email",
  livingSituation: "House with yard",
  reason: "I love animals and have experience with pets",
  createdAt: "4/2/2025",
};

describe("AdoptRequestModal", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    request: mockRequest,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <AdoptRequestModal {...mockProps} isOpen={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render when request is null", () => {
    const { container } = render(
      <AdoptRequestModal {...mockProps} request={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal with request details when open", () => {
    render(<AdoptRequestModal {...mockProps} />);

    expect(
      screen.getByText(`${mockRequest.petName} Adoption Request`)
    ).toBeVisible();
    expect(screen.getByText(mockRequest.name)).toBeVisible();
    expect(screen.getByText(mockRequest.email)).toBeVisible();
    expect(screen.getByText(mockRequest.phone)).toBeVisible();
    expect(screen.getByText(mockRequest.address)).toBeVisible();
    expect(screen.getByText(mockRequest.reason)).toBeVisible();
  });

  it("displays correct status with appropriate styling", () => {
    // Test pending status
    const { rerender } = render(<AdoptRequestModal {...mockProps} />);
    const pendingStatus = screen.getByText("pending");
    expect(pendingStatus).toHaveClass("bg-yellow-400");

    // Test approved status
    rerender(
      <AdoptRequestModal
        {...mockProps}
        request={{ ...mockRequest, status: "approved" }}
      />
    );
    const approvedStatus = screen.getByText("approved");
    expect(approvedStatus).toHaveClass("bg-green-500");

    // Test rejected status
    rerender(
      <AdoptRequestModal
        {...mockProps}
        request={{ ...mockRequest, status: "rejected" }}
      />
    );
    const rejectedStatus = screen.getByText("rejected");
    expect(rejectedStatus).toHaveClass("bg-red-500");
  });

  it("calls onClose when close button is clicked", () => {
    render(<AdoptRequestModal {...mockProps} />);

    // Test top-right close button
    fireEvent.click(screen.getByTestId("icon-X"));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);

    // Test bottom close button
    fireEvent.click(screen.getByText("Close"));
    expect(mockProps.onClose).toHaveBeenCalledTimes(2);
  });

  it("renders all request details sections", () => {
    render(<AdoptRequestModal {...mockProps} />);

    expect(screen.getByText("Adopter:")).toBeVisible();
    expect(screen.getByText("Email:")).toBeVisible();
    expect(screen.getByText("Phone Number:")).toBeVisible();
    expect(screen.getByText("Address:")).toBeVisible();
    expect(screen.getByText("Mode of Communication:")).toBeVisible();
    expect(screen.getByText("Living Situation:")).toBeVisible();
    expect(screen.getByText("Reason for Adoption:")).toBeVisible();
  });
});

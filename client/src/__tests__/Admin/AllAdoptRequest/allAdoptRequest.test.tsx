import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AllAdoptRequests from "../../../pages/Admin/AllAdoptRequest";
import {
  useAllAdoptRequests,
  useAdoptRequestAction,
} from "../../../hooks/useAdoptRequests";
import { mockAdoptRequests } from "../../../__mocks__/mockAdoptRequests";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

jest.mock("../../../hooks/useAdoptRequests");

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <AllAdoptRequests />
    </MemoryRouter>
  );
};
describe("AllAdoptRequests", () => {
  beforeEach(() => {
    (useAllAdoptRequests as jest.Mock).mockReturnValue({
      data: mockAdoptRequests,
      isLoading: false,
    });

    (useAdoptRequestAction as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
  });

  it("renders adoption requests and displays the table", async () => {
    renderComponent();

    // Table content
    expect(screen.getByText("Adoption Requests")).toBeVisible();
    expect(await screen.findByText("Bella")).toBeVisible();
    expect(screen.getByText("John Doe")).toBeVisible();
    expect(screen.getAllByText("pending")[0]).toBeVisible();
    expect(screen.getAllByText("View Details")[0]).toBeVisible();
    expect(screen.getByPlaceholderText("Search")).toBeVisible();
  });

  it("opens and closes the View Details modal", async () => {
    renderComponent();
    const viewButton = screen.getAllByText("View Details")[0];
    fireEvent.click(viewButton);

    expect(screen.getAllByText("Approve")[0]).toBeVisible();
    fireEvent.click(screen.getAllByText("Approve")[0]);
  });

  it("opens confirmation modal for Approve and Reject", async () => {
    renderComponent();

    fireEvent.click(screen.getAllByText("Approve")[0]);
    expect(screen.getByText("Approve Adoption Request")).toBeVisible();

    fireEvent.click(screen.getAllByText("Reject")[0]);
    expect(screen.getByText("Reject Adoption Request")).toBeVisible();
  });

  it("closes the View Details modal", async () => {
    renderComponent();

    fireEvent.click(screen.getAllByText("View Details")[0]);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryAllByText("Approve")[0]).toBeVisible();
    });
  });
  it("calls confirmAction when approving a request", async () => {
    const mutate = jest.fn();
    (useAdoptRequestAction as jest.Mock).mockReturnValue({ mutate });

    renderComponent();

    fireEvent.click(screen.getAllByText("Approve")[0]);
    fireEvent.click(screen.getAllByText("Approve")[5]);
    expect(mutate).toHaveBeenCalledWith({
      id: "1",
      action: "approve",
    });
  });
});

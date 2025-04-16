import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import AllAdoptRequests from "../../../pages/Admin/AllAdoptRequest";
import serverAPI from "../../../helper/axios";
import "@testing-library/jest-dom";
import { mockAdoptRequests } from "../../../__mocks__/mockAdoptRequests";
import { MemoryRouter } from "react-router";
import { createWrapper } from "../../../__mocks__/utils/testUtils";

const wrapper = createWrapper();

const renderComponent = () => {
  return render(
    wrapper({
      children: (
        <MemoryRouter>
          <AllAdoptRequests />
        </MemoryRouter>
      ),
    })
  );
};
// Mock dependencies
jest.mock("../../../helper/axios");
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));
jest.mock("../../../components/AdoptRequest/AdoptRequestModal", () => () => (
  <div>AdoptRequestModal</div>
));

jest.mock(
  "../../../components/WarningModal",
  () =>
    ({
      isModalOpen,
      onConfirm,
    }: {
      isModalOpen: boolean;
      onConfirm: () => void;
    }) =>
      isModalOpen ? (
        <div>
          <div>WarningModal</div>
          <button onClick={onConfirm} data-testid="confirm-button">
            Confirm
          </button>
        </div>
      ) : null
);

jest.mock("lucide-react");

describe("AllAdoptRequests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockAdoptRequests });
  });

  it("renders the component with title and child components", async () => {
    await act(async () => {
      renderComponent();
    });
    await waitFor(() => {
      expect(screen.getByText("Adoption Requests")).toBeVisible();
      expect(screen.getByLabelText("pagesize")).toBeVisible();
      expect(screen.getByRole("table")).toBeVisible();
    });
  });

  it("fetches adoption requests on mount", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: [] });

    await act(async () => {
      renderComponent();
    });
    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/adopt/requests", {
        params: { status: "pending" },
        withCredentials: true,
      });
    });
  });

  it("displays loading spinner while fetching data", async () => {
    (serverAPI.get as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    await act(async () => {
      renderComponent();
    });
    expect(screen.getByTestId("icon-LoaderCircle")).toBeVisible();
  });

  it("opens and closes the AdoptRequestModal", async () => {
    await act(async () => {
      await act(async () => {
        renderComponent();
      });
    });
    fireEvent.click(screen.getAllByText("View Details")[0]);
    expect(screen.getByText("AdoptRequestModal")).toBeVisible();
  });

  it("opens and closes the WarningModal for approve action", async () => {
    await act(async () => {
      renderComponent();
    });
    fireEvent.click(screen.getAllByText("Approve")[0]);
    expect(screen.getByText("WarningModal")).toBeVisible();
  });

  it("calls API to approve a request", async () => {
    (serverAPI.put as jest.Mock).mockResolvedValue({});
    await act(async () => {
      renderComponent();
    });

    fireEvent.click(screen.getAllByText("Approve")[0]);
    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(serverAPI.put).toHaveBeenCalledWith(
        "/adopt/1/approve",
        {},
        { withCredentials: true }
      );
    });
  });

  it("calls API to reject a request", async () => {
    (serverAPI.put as jest.Mock).mockResolvedValue({});
    await act(async () => {
      renderComponent();
    });

    fireEvent.click(screen.getAllByText("Reject")[0]);
    fireEvent.click(screen.getByTestId("confirm-button"));

    await waitFor(() => {
      expect(serverAPI.put).toHaveBeenCalledWith(
        "/adopt/1/reject",
        {},
        { withCredentials: true }
      );
    });
  });

  it("handles API errors gracefully", async () => {
    const error = { response: { data: { error: "Test error" } } };
    (serverAPI.get as jest.Mock).mockRejectedValue(error);

    // Mock console.error
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      renderComponent();
    });

    // Wait for the API call and error handling
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Error fetching adoption requests:",
        error
      );
    });

    // Restore the original console.error
    consoleErrorMock.mockRestore();
  });

  it("fetches data when status filter changes", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: [] });

    await act(async () => {
      renderComponent();
    });
    fireEvent.change(screen.getByLabelText("status"), {
      target: { value: "approved" },
    });

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/adopt/requests", {
        params: { status: "approved" },
        withCredentials: true,
      });
    });
  });
});

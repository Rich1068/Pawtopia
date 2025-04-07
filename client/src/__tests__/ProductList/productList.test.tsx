import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProductList from "../../pages/Admin/ProductList";
import serverAPI from "../../helper/axios";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import "@testing-library/jest-dom";
import { mockProducts } from "../../__mocks__/mockProducts";
import { MemoryRouter } from "react-router";

jest.mock("../../helper/axios");
jest.mock("../../components/LoadingPage/LoadingPage");
jest.mock(
  "../../components/shop/Admin/ProductList/ProductActionButtons",
  () => ({
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ product, onDelete }: any) => (
      <button
        data-testid={`delete-${product._id}`}
        onClick={() => onDelete(product._id)}
      >
        Delete
      </button>
    ),
  })
);

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <ProductList />
    </MemoryRouter>
  );
};
describe("ProductList Component", () => {
  beforeEach(() => {
    (serverAPI.get as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        data: { data: mockProducts },
      });
    });
    (LoadingPage as jest.Mock).mockImplementation(() => <div>Loading...</div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state initially", async () => {
    (serverAPI.get as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Mocking ongoing request
    renderComponent();

    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("should display the product list after data is fetched", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Premium Dog Food")).toBeVisible();
      expect(screen.getByText("Cat Scratching Post")).toBeVisible();
      expect(screen.getByText("$25")).toBeVisible();
      expect(screen.getByText("$40")).toBeVisible();
    });
  });

  it("should call delete handler when delete button is clicked", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Premium Dog Food")).toBeVisible();
      expect(screen.getByText("Cat Scratching Post")).toBeVisible();
    });

    fireEvent.click(screen.getByTestId("delete-1"));

    await waitFor(() => {
      expect(screen.queryByText("Premium Dog Food")).not.toBeInTheDocument();
    });
  });

  it("should show filters and table components", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Select categories...")).toBeVisible();
      expect(screen.getByText("Premium Dog Food")).toBeVisible();
    });
  });
});

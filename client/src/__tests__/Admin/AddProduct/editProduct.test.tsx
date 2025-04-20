// EditProduct.test.tsx
import { render, screen } from "@testing-library/react";
import EditProduct from "../../../pages/Admin/EditProduct";
import { useProduct } from "../../../hooks/useProducts";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mock the hook and components
jest.mock("../../../hooks/useProducts");

jest.mock("react-router", () => {
  const actual = jest.requireActual("react-router");
  return {
    ...actual,
    useParams: () => ({ id: "123" }),
    useNavigate: jest.fn(),
  };
});

jest.mock("../../../pages/Admin/AddProducts", () =>
  jest.fn(() => <div>AddProductComponent</div>)
);
jest.mock("../../../components/LoadingPage/LoadingPage", () => () => (
  <div>Loading...</div>
));
jest.mock("../../../components/WarningContainer", () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ header, text, confirmText, onConfirm }: any) => (
    <div>
      <h2>{header}</h2>
      <p>{text}</p>
      <button onClick={onConfirm}>{confirmText}</button>
    </div>
  )
);

const mockedUseProduct = useProduct as jest.Mock;
const mockNavigate = useNavigate as jest.Mock;

describe("EditProduct UI", () => {
  const renderWithRouter = () =>
    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditProduct />} />
        </Routes>
      </MemoryRouter>
    );

  it("shows loading state", () => {
    mockedUseProduct.mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
      refetch: jest.fn(),
    });

    renderWithRouter();

    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("shows error UI when product is not found", () => {
    mockedUseProduct.mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      refetch: jest.fn(),
    });

    renderWithRouter();

    expect(screen.getByText("Product Not Found")).toBeVisible();
    expect(screen.getByText(/doesn't exist/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /back/i })).toBeVisible();
  });

  it("shows error UI when product is null", () => {
    mockedUseProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: null,
      refetch: jest.fn(),
    });

    renderWithRouter();

    expect(screen.getByText("Product Not Found")).toBeVisible();
  });

  it("renders AddProduct when product is available", () => {
    mockedUseProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { name: "Product A", id: "123" },
      refetch: jest.fn(),
    });

    renderWithRouter();

    expect(screen.getByText("AddProductComponent")).toBeVisible();
  });

  it("calls navigate(-1) when Back button is clicked", async () => {
    const mockNavFn = jest.fn();
    mockNavigate.mockReturnValue(mockNavFn);

    mockedUseProduct.mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      refetch: jest.fn(),
    });

    renderWithRouter();

    const backBtn = screen.getByRole("button", { name: /back/i });
    await userEvent.click(backBtn);

    expect(mockNavFn).toHaveBeenCalledWith(-1);
  });
});

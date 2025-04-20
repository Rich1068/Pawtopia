import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import CheckoutSuccess from "../../pages/CheckoutSuccess";
import * as useOrderCheckoutHook from "../../hooks/useOrderCheckout";
import { UseQueryResult } from "@tanstack/react-query";
import { IOrder } from "../../types/Types";
import "@testing-library/jest-dom";
import { mockOrder } from "../../__mocks__/mockOrders";

// Mock react-router hooks
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useSearchParams: () => [
    {
      get: () => "mock-session-id",
    },
  ],
  useNavigate: () => jest.fn(),
}));

describe("CheckoutSuccess Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading page", () => {
    jest.spyOn(useOrderCheckoutHook, "useOrderCheckout").mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as UseQueryResult<IOrder, Error>);

    render(
      <MemoryRouter>
        <CheckoutSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeVisible();
  });

  it("shows error message when hook returns isError", () => {
    jest.spyOn(useOrderCheckoutHook, "useOrderCheckout").mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as UseQueryResult<IOrder, Error>);

    render(
      <MemoryRouter>
        <CheckoutSuccess />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/something went wrong. please try again later/i)
    ).toBeVisible();
  });

  it("displays order success details when data is loaded", async () => {
    jest.spyOn(useOrderCheckoutHook, "useOrderCheckout").mockReturnValue({
      data: mockOrder,
      isLoading: false,
      isError: false,
    } as UseQueryResult<IOrder, Error>);

    render(
      <MemoryRouter>
        <CheckoutSuccess />
      </MemoryRouter>
    );

    expect(await screen.findByText("🎉 Success!")).toBeVisible();
    expect(screen.getByText("ORD123")).toBeVisible();
    expect(screen.getByText("$99.99")).toBeVisible();

    expect(screen.getByText("Test Product 1")).toBeVisible();
    expect(screen.getByText("$29.99 x 2")).toBeVisible();
    expect(screen.getByText("Test Product 2")).toBeVisible();
    expect(screen.getByText("$39.99 x 1")).toBeVisible();

    expect(screen.getByText(/continue shopping/i)).toBeVisible();
  });
});

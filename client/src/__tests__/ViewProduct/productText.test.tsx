import { render, screen } from "@testing-library/react";
import ProductText from "../../components/shop/ViewProduct/ProductText";
import { mockProduct } from "../../__mocks__/mockProducts";
import { IProduct } from "../../types/Types";
import "@testing-library/jest-dom";

// Mock AdminButtons and UserButtons
jest.mock("../../components/shop/ViewProduct/AdminButtons", () => () => (
  <div data-testid="admin-buttons">AdminButtons</div>
));
jest.mock("../../components/shop/ViewProduct/UserButtons", () => () => (
  <div data-testid="user-buttons">UserButtons</div>
));

// Use your provided mock product
describe("ProductText", () => {
  it("renders product information correctly", () => {
    render(
      <ProductText
        productData={mockProduct}
        isAdmin={false}
        isAdminView={false}
      />
    );

    expect(screen.getByText("Premium Dog Food")).toBeVisible();
    expect(screen.getByText("Healthy food for dogs")).toBeVisible();
    expect(screen.getByText("Dog Supplies")).toBeVisible();
    expect(screen.getByText("$25.00")).toBeVisible();
  });

  it("displays UserButtons for non-admin users", () => {
    render(
      <ProductText
        productData={mockProduct}
        isAdmin={false}
        isAdminView={false}
      />
    );
    expect(screen.getByTestId("user-buttons")).toBeVisible();
    expect(screen.queryByTestId("admin-buttons")).not.toBeInTheDocument();
  });

  it("displays AdminButtons for admin in admin view", () => {
    render(
      <ProductText
        productData={mockProduct}
        isAdmin={true}
        isAdminView={true}
      />
    );
    expect(screen.getByTestId("admin-buttons")).toBeVisible();
    expect(screen.queryByTestId("user-buttons")).not.toBeInTheDocument();
  });

  it("shows '(Not Available)' if the product is archived", () => {
    const archivedProduct: IProduct = { ...mockProduct, isArchived: true };
    render(
      <ProductText
        productData={archivedProduct}
        isAdmin={false}
        isAdminView={false}
      />
    );
    expect(
      screen.getByText(/Premium Dog Food \(Not Available\)/)
    ).toBeVisible();
  });
});

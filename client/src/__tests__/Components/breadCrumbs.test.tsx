import { render, screen } from "@testing-library/react";
import { InitialEntry, MemoryRouter } from "react-router";
import Breadcrumbs from "../../components/BreadCrumbs";
import "@testing-library/jest-dom";

describe("Breadcrumbs Component", () => {
  const renderWithRouter = (initialEntries: InitialEntry) => {
    return render(
      <MemoryRouter initialEntries={[initialEntries]}>
        <Breadcrumbs />
      </MemoryRouter>
    );
  };

  test("renders home link correctly", () => {
    renderWithRouter("/");
    expect(screen.getByText("Home")).toBeVisible();
  });

  test("renders Adopt > Pet Details for adopt route", () => {
    renderWithRouter("/adopt/pets/123");
    expect(screen.getByText("Adopt")).toBeVisible();
    expect(screen.getByText("Pet Details")).toBeVisible();
  });

  test("renders Shop > Product Details for shop route", () => {
    renderWithRouter("/shop/product/456");
    expect(screen.getByText("Shop")).toBeVisible();
    expect(screen.getByText("Product Details")).toBeVisible();
  });

  test("decodes URI components in breadcrumbs", () => {
    renderWithRouter("/category/%E2%9C%94");

    expect(screen.getByText("✔")).toBeInTheDocument();
  });
});

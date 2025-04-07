import { render, screen } from "@testing-library/react";
import PageHeader from "../../components/PageHeader";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

jest.mock("../../components/BreadCrumbs", () => () => (
  <div data-testid="breadcrumbs" />
));

describe("PageHeader Component", () => {
  test("renders the header with provided text", () => {
    render(
      <MemoryRouter>
        <PageHeader text="Adopt a Pet" />
      </MemoryRouter>
    );

    const headerText = screen.getByText("Adopt a Pet");
    expect(headerText).toBeVisible();
  });

  test("renders the PawPrint icon", () => {
    render(
      <MemoryRouter>
        <PageHeader text="Adopt a Pet" />
      </MemoryRouter>
    );

    const pawPrintIcon = screen.getByTestId("icon-PawPrint");
    expect(pawPrintIcon).toBeVisible();
  });

  test("renders Breadcrumbs component", () => {
    render(
      <MemoryRouter>
        <PageHeader text="Shop" />
      </MemoryRouter>
    );

    expect(screen.getByTestId("breadcrumbs")).toBeVisible();
  });

  test("does not render anything when no text is provided", () => {
    render(
      <MemoryRouter>
        <PageHeader />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("breadcrumbs")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import PetHeader from "../../components/PetPage/PetHeader";
import "@testing-library/jest-dom";

jest.mock("../../components/BreadCrumbs", () => () => (
  <div data-testid="breadcrumbs" />
));

describe("Pet Header Component", () => {
  it("pet header is visible", () => {
    render(<PetHeader />);

    expect(screen.getByText("Pet Details")).toBeVisible();
  });
  it("breadcrumbs is visible", () => {
    render(<PetHeader />);

    expect(screen.getByTestId("breadcrumbs")).toBeVisible();
  });
});

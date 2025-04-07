import { render, screen } from "@testing-library/react";
import Contact from "../../pages/Contact";
import "@testing-library/jest-dom";

jest.mock("../../components/PageHeader", () => () => (
  <div data-testid="mock-page-header">Mock Page Header</div>
));
jest.mock("../../components/Contact/ContactSection", () => () => (
  <div data-testid="mock-contact-section">Mock Contact Section</div>
));

describe("Contact Page", () => {
  it("renders PageHeader and ContactSection", () => {
    render(<Contact />);

    expect(screen.getByTestId("mock-page-header")).toBeVisible();
    expect(screen.getByTestId("mock-contact-section")).toBeVisible();
  });
});

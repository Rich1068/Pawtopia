import { render, screen } from "@testing-library/react";
import Landing from "../../pages/Landing";
import "@testing-library/jest-dom";

jest.mock("../../components/Landing/HeroSection", () => () => (
  <div data-testid="mock-hero-section">Mock Hero Section</div>
));
jest.mock("../../components/Landing/CenterText", () => () => (
  <div data-testid="mock-center-text">Mock Center Text</div>
));
jest.mock("../../components/Landing/HeroSection2", () => () => (
  <div data-testid="mock-hero-section2">Mock Hero Section 2</div>
));
jest.mock("../../components/Landing/Carousel/Carousel", () => () => (
  <div data-testid="mock-carousel">Mock Carousel</div>
));

describe("Landing Page", () => {
  it("renders all landing sections", () => {
    render(<Landing />);

    expect(screen.getByTestId("mock-hero-section")).toBeVisible();
    expect(screen.getByTestId("mock-center-text")).toBeVisible();
    expect(screen.getByTestId("mock-hero-section2")).toBeVisible();
    expect(screen.getByTestId("mock-carousel")).toBeVisible();
  });
});

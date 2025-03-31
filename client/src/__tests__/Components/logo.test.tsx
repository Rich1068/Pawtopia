import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Logo from "../../components/Logo";
import "@testing-library/jest-dom";

describe("Logo Component", () => {
  test("renders the logo with the correct image and text", () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );

    const logoImage = screen.getByAltText("logo");
    expect(logoImage).toBeVisible();
    expect(logoImage).toHaveAttribute("src", "/assets/img/Logo1.png");

    const logoText = screen.getByText("Pawtopia");
    expect(logoText).toBeVisible();
  });
});

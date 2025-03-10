import { render, screen } from "@testing-library/react";
import Cards from "../../components/Adopt/Cards";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { mockPets } from "../../__mocks__/mockPets";

const mockCleanImageUrl = jest.fn();

describe("Cards component", () => {
  it("renders pet cards when pets are provided", () => {
    render(
      <MemoryRouter>
        <Cards pets={mockPets} cleanImageUrl={mockCleanImageUrl} />
      </MemoryRouter>
    );

    expect(screen.getByText("Kaia Carson")).toBeVisible();
    expect(screen.getByText("Milo Whiskers")).toBeVisible();
  });

  it("renders the correct number of cards", () => {
    render(
      <MemoryRouter>
        <Cards pets={mockPets} cleanImageUrl={mockCleanImageUrl} />
      </MemoryRouter>
    );

    const petCards = screen.getAllByRole("link");
    expect(petCards.length).toBe(2);
  });

  it("shows 'No Pets Available' message when pets array is empty", () => {
    render(
      <MemoryRouter>
        <Cards pets={[]} cleanImageUrl={mockCleanImageUrl} />
      </MemoryRouter>
    );

    expect(screen.getByText("No Pets Available")).toBeVisible();
    expect(
      screen.getByText("Check back later or try selecting different filters.")
    ).toBeVisible();
  });
});

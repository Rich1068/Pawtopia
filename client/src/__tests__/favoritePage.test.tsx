/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import Favorite from "../pages/Favorite";
import { useFavoritePets } from "../hooks/useFavoritePets";
import { mockPets } from "../__mocks__/mockPets";
import "@testing-library/jest-dom";
import { petType } from "../types/pet";

jest.mock("../hooks/useFavoritePets");

jest.mock(
  "../components/Adopt/AdoptCards",
  () =>
    ({ pets, header, text }: any) =>
      (
        <div data-testid="adopt-cards">
          <div>{header}</div>
          <div>{text}</div>
          {pets.map((pet: petType) => (
            <p key={pet.id}>{pet.attributes.name}</p>
          ))}
        </div>
      )
);

jest.mock("../components/PageHeader", () => ({ text }: any) => <h1>{text}</h1>);

jest.mock("../components/LoadingPage/LoadingPage", () => ({ fadeOut }: any) => (
  <div data-testid="loading-page">Loading... {String(fadeOut)}</div>
));

describe("Favorite Page", () => {
  const mockUseFavoritePets = useFavoritePets as jest.Mock;

  it("shows loading screen if data is loading", () => {
    mockUseFavoritePets.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<Favorite />);
    expect(screen.getByTestId("loading-page")).toBeVisible();
  });

  it("displays favorite pets when loaded", async () => {
    mockUseFavoritePets.mockReturnValue({
      data: mockPets,
      isLoading: false,
    });

    render(<Favorite />);

    await waitFor(() => {
      expect(screen.getByText("My Favorites")).toBeVisible();
      expect(screen.getByText("Kaia Carson")).toBeVisible();
      expect(screen.getByText("Milo Whiskers")).toBeVisible();
    });
  });

  it("displays 'no favorites' message when data is empty", async () => {
    mockUseFavoritePets.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<Favorite />);

    await waitFor(() => {
      expect(screen.getByText("No Favorites Yet")).toBeVisible();
      expect(
        screen.getByText("Start adding pets to your favorites!")
      ).toBeVisible();
    });
  });
});

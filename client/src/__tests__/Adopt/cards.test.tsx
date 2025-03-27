import { render, screen, waitFor } from "@testing-library/react";
import AdoptCards from "../../components/Adopt/AdoptCards";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { mockPets } from "../../__mocks__/mockPets";
import { FavoritesProvider } from "../../context/FavoritesContext";
import { AuthProvider } from "../../context/AuthContext";

const renderCard = (pets = mockPets) => {
  return render(
    <AuthProvider>
      <FavoritesProvider>
        <MemoryRouter>
          <AdoptCards
            pets={pets}
            header={"No Pets Available"}
            text={"Check back later or try selecting different filters."}
          />
        </MemoryRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
};

describe("Cards component", () => {
  it("renders pet cards when pets are provided", async () => {
    renderCard();
    await waitFor(() => {
      expect(screen.getByText("Kaia Carson")).toBeVisible();
      expect(screen.getByText("Milo Whiskers")).toBeVisible();
    });
  });

  it("renders the correct number of cards", async () => {
    renderCard();
    await waitFor(() => {
      const petCards = screen.getAllByRole("link");
      expect(petCards.length).toBe(2);
    });
  });

  it("shows 'No Pets Available' message when pets array is empty", async () => {
    renderCard([]);
    await waitFor(() => {
      expect(screen.getByText("No Pets Available")).toBeVisible();
      expect(
        screen.getByText("Check back later or try selecting different filters.")
      ).toBeVisible();
    });
  });
});

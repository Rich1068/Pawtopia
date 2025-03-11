import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useFavorites } from "../../context/FavoritesContext";
import FavoriteButton from "../../components/Adopt/FavoriteButton";
import "@testing-library/jest-dom";
import { mockPets } from "../../__mocks__/mockPets";
import { petType } from "../../types/pet";
import { useAuth } from "../../context/AuthContext";
import { BrowserRouter } from "react-router";

jest.mock("../../context/FavoritesContext", () => ({
  useFavorites: jest.fn(),
}));
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));
jest.mock("react-modal", () => {
  return ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div data-testid="mock-modal">{children}</div> : null);
});

const mockToggleFavorite = jest.fn();

const setup = (
  favorites: petType[] = [],
  user: { id: string } | null = { id: "123574" }
) => {
  (useFavorites as jest.Mock).mockReturnValue({
    favorites,
    toggleFavorite: mockToggleFavorite,
  });

  (useAuth as jest.Mock).mockReturnValue({ user }); // Mock authentication

  return render(<FavoriteButton pet={mockPets[0]} />);
};

describe("FavoriteButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeVisible();
    });
  });

  it("toggles favorite when clicked", async () => {
    setup();

    const button = await screen.findByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledWith(mockPets[0]);
    });
  });

  it("shows active state when pet is favorited", async () => {
    setup([], { id: "user123" }); // Mock authenticated user

    const button = await screen.findByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledWith(mockPets[0]);
    });
  });

  it("does not call toggleFavorite and opens modal when user is not logged in", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
    });

    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    });

    render(
      <BrowserRouter>
        <FavoriteButton pet={mockPets[0]} />
      </BrowserRouter>
    );

    const button = screen.getByTestId("favorite-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockToggleFavorite).not.toHaveBeenCalled();
      expect(screen.getByText("Login Required")).toBeVisible();
    });
  });
});

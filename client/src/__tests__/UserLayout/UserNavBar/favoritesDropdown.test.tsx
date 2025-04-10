import { render, screen, fireEvent } from "@testing-library/react";
import FavoriteDropdown from "../../../components/Layout/User/NavBarComponents/FavoritesDropdown";
import { useFavorites } from "../../../context/FavoritesContext";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

jest.mock("../../../context/FavoritesContext", () => ({
  useFavorites: jest.fn(),
}));

const mockUseFavorites = useFavorites as jest.Mock;

describe("FavoritesDropdown Component", () => {
  const mockFavorites = [
    {
      petId: "1",
      petName: "Buddy",
      petImage: "/buddy.jpg",
    },
    {
      petId: "2",
      petName: "Max",
      petImage: "/max.jpg",
    },
  ];

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <FavoriteDropdown />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the favorites dropdown button", () => {
    mockUseFavorites.mockReturnValue({ favorites: [] });

    renderComponent();

    const favoriteButton = screen.getByRole("button");
    expect(favoriteButton).toBeVisible();
    expect(favoriteButton).toHaveClass("text-orange-500");
  });

  it("displays the correct number of favorites", () => {
    mockUseFavorites.mockReturnValue({ favorites: mockFavorites });

    renderComponent();

    const favoriteCount = screen.getByText(mockFavorites.length.toString());
    expect(favoriteCount).toBeVisible();
  });

  it("toggles the favorites dropdown open and closed", () => {
    mockUseFavorites.mockReturnValue({ favorites: mockFavorites });

    renderComponent();

    const favoriteButton = screen.getByRole("button");

    // Open the dropdown
    fireEvent.click(favoriteButton);
    expect(screen.getByText("Buddy")).toBeVisible();
    expect(screen.getByText("Max")).toBeVisible();

    // Close the dropdown
    fireEvent.click(favoriteButton);
    expect(screen.queryByText("Buddy")).not.toBeInTheDocument();
    expect(screen.queryByText("Max")).not.toBeInTheDocument();
  });

  it("displays 'No favorites yet' when there are no favorites", () => {
    mockUseFavorites.mockReturnValue({ favorites: [] });

    renderComponent();

    const favoriteButton = screen.getByRole("button");
    fireEvent.click(favoriteButton);

    expect(screen.getByText("No favorites yet")).toBeVisible();
  });

  it("closes the dropdown when clicking on a favorite item", () => {
    mockUseFavorites.mockReturnValue({ favorites: mockFavorites });

    renderComponent();

    const favoriteButton = screen.getByRole("button");
    fireEvent.click(favoriteButton);

    const favoriteLink = screen.getByRole("link", { name: /Buddy/i });
    fireEvent.click(favoriteLink);

    expect(screen.queryByText("Buddy")).not.toBeInTheDocument();
  });

  it("closes the dropdown when clicking on the 'Show All' link", () => {
    mockUseFavorites.mockReturnValue({ favorites: mockFavorites });

    renderComponent();

    const favoriteButton = screen.getByRole("button");
    fireEvent.click(favoriteButton);

    const showAllLink = screen.getByText("Show All");
    fireEvent.click(showAllLink);

    expect(screen.queryByText("Buddy")).not.toBeInTheDocument();
  });

  it("closes the dropdown when clicking outside", () => {
    mockUseFavorites.mockReturnValue({ favorites: mockFavorites });

    renderComponent();

    const favoriteButton = screen.getByRole("button");
    fireEvent.click(favoriteButton);

    // Simulate clicking outside the dropdown
    fireEvent.mouseDown(document);

    expect(screen.queryByText("Buddy")).not.toBeInTheDocument();
  });
});

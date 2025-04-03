import { render, screen, waitFor } from "@testing-library/react";
import { useFavorites } from "../context/FavoritesContext";
import serverAPI from "../helper/axios";
import Favorite from "../pages/Favorite";
import AdoptCards from "../components/Adopt/AdoptCards";
import PageHeader from "../components/PageHeader";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import "@testing-library/jest-dom";

jest.mock("../context/FavoritesContext");
jest.mock("../helper/axios");
jest.mock("../components/Adopt/AdoptCards");
jest.mock("../components/PageHeader");
jest.mock("../components/LoadingPage/LoadingPage");

describe("Favorite Component", () => {
  const mockFavorites = [
    { petId: "1", name: "Fluffy" },
    { petId: "2", name: "Spot" },
  ];

  const mockPets = [
    { id: "1", name: "Fluffy", breed: "Persian", age: 3 },
    { id: "2", name: "Spot", breed: "Dalmatian", age: 2 },
  ];

  beforeEach(() => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
    });
    (PageHeader as jest.Mock).mockImplementation(({ text }) => (
      <div>{text}</div>
    ));
    (AdoptCards as jest.Mock).mockImplementation(() => <div>AdoptCards</div>);
    (LoadingPage as jest.Mock).mockImplementation(() => <div>Loading...</div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    render(<Favorite />);
    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("does not fetch pets when no favorites exist", async () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
    });

    render(<Favorite />);

    await waitFor(() => {
      expect(serverAPI.post).not.toHaveBeenCalled();
      expect(screen.getByText("AdoptCards")).toBeVisible();
    });
  });

  it("fetches and displays favorite pets", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { pets: mockPets },
    });

    render(<Favorite />);

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith(
        "/pet/get-favPets",
        { petIds: ["1", "2"] },
        { withCredentials: true }
      );
      expect(AdoptCards).toHaveBeenCalledWith(
        expect.objectContaining({
          pets: mockPets,
          header: "No Favorites Yet",
          text: "Start adding pets to your favorites!",
        }),
        undefined
      );
    });
  });

  it("handles API errors gracefully", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValue(new Error("API Error"));
    console.error = jest.fn(); // Mock console.error

    render(<Favorite />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch favorite pets",
        expect.any(Error)
      );
      expect(screen.getByText("AdoptCards")).toBeVisible();
    });
  });

  it("renders the correct page header", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { pets: mockPets },
    });

    render(<Favorite />);

    await waitFor(() => {
      expect(PageHeader).toHaveBeenCalledWith(
        expect.objectContaining({ text: "My Favorites" }),
        undefined
      );
    });
  });
});

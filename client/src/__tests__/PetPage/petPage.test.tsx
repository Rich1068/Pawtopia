import { render, screen, waitFor } from "@testing-library/react";
import PetPage from "../../pages/PetPage";
import { MemoryRouter, Route, Routes } from "react-router";
import serverAPI from "../../helper/axios";
import { mockPets } from "../../__mocks__/mockPets";
import "@testing-library/jest-dom";

// Mock components used inside PetPage
jest.mock("../../components/PetPage/PetCarousel", () => () => (
  <div>PetCarousel Mock</div>
));
jest.mock("../../components/PetPage/PetPageText", () => () => (
  <div>PetPageText Mock</div>
));
jest.mock("../../components/LoadingPage/LoadingPage", () => () => (
  <div>Loading...</div>
));
jest.mock("../../components/PageHeader", () => ({ text }: { text: string }) => (
  <div>{text}</div>
));

describe("PetPage", () => {
  it("renders loading and then pet details", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: { data: [mockPets[0]] },
    });

    render(
      <MemoryRouter initialEntries={["/adopt/pets/123"]}>
        <Routes>
          <Route path="/adopt/pets/:id" element={<PetPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Should show loading first
    expect(screen.getByText("Loading...")).toBeVisible();

    // Wait for pet data to load
    await waitFor(() => {
      expect(screen.getByText("Pet Details")).toBeVisible();
      expect(screen.getByText("PetCarousel Mock")).toBeVisible();
      expect(screen.getByText("PetPageText Mock")).toBeVisible();
    });

    expect(serverAPI.get).toHaveBeenCalledWith("pet/get-pet-data/123");
  });
  it("handles API failure gracefully", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    render(
      <MemoryRouter initialEntries={["/adopt/pets/404"]}>
        <Routes>
          <Route path="/adopt/pets/:id" element={<PetPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Shows loading first
    expect(screen.getByText("Loading...")).toBeVisible();

    await waitFor(() => {
      expect(screen.getByText("Pet Not Found")).toBeVisible();

      expect(screen.queryByText("PetCarousel Mock")).not.toBeInTheDocument();
      expect(screen.queryByText("PetPageText Mock")).not.toBeInTheDocument();
    });
  });
});

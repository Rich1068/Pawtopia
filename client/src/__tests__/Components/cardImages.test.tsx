import { render, screen, fireEvent } from "@testing-library/react";
import CardImages from "../../components/CardImages";
import { petType } from "../../types/pet";
import "@testing-library/jest-dom";

jest.mock("../../components/Adopt/FavoriteButton", () =>
  jest.fn(() => <div data-testid="favorite-button" />)
);

describe("CardImages Component", () => {
  const mockPet = {
    relationships: {},
    attributes: {},
  } as unknown as petType;

  const mockGetImageUrls = jest.fn(() => ["image1.jpg", "image2.jpg"]);

  test("renders first image correctly", () => {
    render(<CardImages item={mockPet} getImageUrls={mockGetImageUrls} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "image1.jpg");
  });

  test("falls back to next image on error", () => {
    render(<CardImages item={mockPet} getImageUrls={mockGetImageUrls} />);
    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(img).toHaveAttribute("src", "image2.jpg");
  });

  test("displays fallback image when all images fail", () => {
    render(<CardImages item={mockPet} getImageUrls={() => []} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "assets/img/Logo1.png");
  });

  test("renders FavoriteButton when item has relationships and attributes", () => {
    render(<CardImages item={mockPet} getImageUrls={mockGetImageUrls} />);
    expect(screen.getByTestId("favorite-button")).toBeVisible();
  });
});

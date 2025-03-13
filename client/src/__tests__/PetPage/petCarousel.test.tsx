import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PetCarousel from "../../components/PetPage/PetCarousel";
import { mockPets } from "../../__mocks__/mockPets";
import "@testing-library/jest-dom";
import SwiperClass from "swiper";

// Mock Swiper & Modal
jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("swiper/modules", () => ({
  FreeMode: () => null,
  Navigation: () => null,
  Thumbs: () => null,
}));
jest.mock("react-modal", () => {
  return ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null);
});

const cleanImageUrl = (url: string | undefined) => url;

const renderCarousel = (petData = mockPets[0]) =>
  render(
    <PetCarousel
      thumbsSwiper={null}
      setThumbsSwiper={jest.fn()}
      petData={petData}
      cleanImageUrl={cleanImageUrl}
    />
  );

describe("PetCarousel", () => {
  it("renders pet images if available", () => {
    renderCarousel();
    const images = screen.getAllByAltText("Pet");
    expect(images.length).toBe(2);
  });

  it("renders placeholder image when no pictures are available", () => {
    renderCarousel(mockPets[1]);
    expect(screen.getByAltText("Placeholder Logo")).toBeVisible();
  });

  it("handles thumbnail hover to update main carousel", () => {
    const slideTo = jest.fn();
    const mockSwiper = { slideTo } as unknown as SwiperClass;
    renderCarousel();

    const thumbnails = screen.getAllByAltText("Thumbnail");
    fireEvent.mouseOver(thumbnails[1]);

    waitFor(() => expect(mockSwiper).toHaveBeenCalledWith(1));
  });

  it("opens modal on image click", () => {
    renderCarousel();
    fireEvent.click(screen.getAllByAltText("Pet")[0]);
    expect(screen.getByTestId("modal")).toBeVisible();
    expect(screen.getByAltText("Large preview")).toBeVisible();
  });

  it("closes modal when close button is clicked", () => {
    renderCarousel();
    fireEvent.click(screen.getAllByAltText("Pet")[0]);
    fireEvent.click(screen.getByTestId("close-modal-button"));
  });

  it("click next button", () => {
    const slideNext = jest.fn();
    const fakeSwiper = { slideNext } as unknown as SwiperClass;

    renderCarousel();
    const nextButton = screen.getByTestId("next-button");
    (nextButton as HTMLElement).onclick = () => fakeSwiper.slideNext();
    fireEvent.click(nextButton);
    expect(slideNext).toHaveBeenCalled();
  });

  it("click prev button", () => {
    const slidePrev = jest.fn();
    const fakeSwiper = { slidePrev } as unknown as SwiperClass;

    renderCarousel();
    const prevButton = screen.getByTestId("prev-button");
    (prevButton as HTMLElement).onclick = () => fakeSwiper.slidePrev();
    fireEvent.click(prevButton);
    expect(slidePrev).toHaveBeenCalled();
  });
});

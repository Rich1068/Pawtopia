import { render, screen, fireEvent } from "@testing-library/react";
import ProductCarousel from "../../components/shop/ViewProduct/ProductCarousel";
import { Swiper as SwiperClass } from "swiper/types";
import "@testing-library/jest-dom";
import { mockProducts } from "../../__mocks__/mockProducts";
import React from "react";

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

// Mock the icons
jest.mock("lucide-react");

jest.mock("swiper/modules", () => ({
  FreeMode: () => null,
  Navigation: () => null,
  Thumbs: () => null,
}));

// Mock the ImageModal component
jest.mock("../../components/ImageModal", () => ({
  __esModule: true,
  default: ({
    imageUrl,
    isOpen,
    onClose,
  }: {
    imageUrl: string | null;
    isOpen: boolean;
    onClose: () => void;
  }) => (
    <div data-testid="image-modal">
      {isOpen && (
        <div>
          <div>Modal Content: {imageUrl}</div>
          <button onClick={onClose} data-testid="close-modal-button">
            Close
          </button>
        </div>
      )}
    </div>
  ),
}));

describe("ProductCarousel", () => {
  beforeEach(() => {
    jest.mock("../../helper/imageHelper", () => ({
      getFullImageUrl: (img: string) => `http://example.com/${img}`,
    }));
  });

  it("renders without crashing", () => {
    render(<ProductCarousel productData={mockProducts[0]} />);
    const swipers = screen.getAllByTestId("main-swiper");
    expect(swipers.length).toBe(2);
  });

  it("displays product images when available", () => {
    render(<ProductCarousel productData={mockProducts[0]} />);

    const images = screen.getAllByRole("img");
    expect(images.length).toBe(mockProducts[0].images.length * 2);

    mockProducts[0].images.forEach((img, index) => {
      expect(images[index]).toHaveAttribute(
        "src",
        expect.stringContaining(img)
      );
    });
  });

  it("displays placeholder image when no product images are available", () => {
    render(<ProductCarousel productData={mockProducts[4]} />);

    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("src", "/assets/img/Logo1.png");
  });

  it("opens modal when an image is clicked", () => {
    render(<ProductCarousel productData={mockProducts[0]} />);

    const firstImage = screen.getAllByRole("img")[0];
    fireEvent.click(firstImage);

    expect(screen.getByText(/Modal Content:/)).toBeVisible();
    expect(screen.getByText(/Modal Content:/)).toHaveTextContent(
      mockProducts[0].images[0]
    );
  });

  it("closes modal when handleCloseModal is called", () => {
    render(<ProductCarousel productData={mockProducts[0]} />);

    // Open modal
    const firstImage = screen.getAllByRole("img")[0];
    fireEvent.click(firstImage);

    // Close modal
    const modal = screen.getByTestId("close-modal-button");
    fireEvent.click(modal);

    expect(screen.queryByText(/Modal Content:/)).not.toBeInTheDocument();
  });

  it("navigates slides when navigation buttons are clicked", () => {
    const mockSwiper = {
      slidePrev: jest.fn(),
      slideNext: jest.fn(),
      slideTo: jest.fn(),
      destroyed: false,
    } as unknown as SwiperClass;

    // Mock the Swiper ref
    jest.spyOn(React, "useRef").mockReturnValueOnce({
      current: mockSwiper,
    });

    render(<ProductCarousel productData={mockProducts[0]} />);

    const prevButton = screen.getByTestId("prev-button");
    const nextButton = screen.getByTestId("next-button");

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(mockSwiper.slidePrev).toHaveBeenCalled();
    expect(mockSwiper.slideNext).toHaveBeenCalled();
  });

  it("handles image error by showing placeholder", () => {
    render(<ProductCarousel productData={mockProducts[0]} />);

    const images = screen.getAllByRole("img");
    fireEvent.error(images[0]);

    expect(images[0]).toHaveAttribute("src", "/assets/img/Logo1.png");
  });

  it("renders correct number of thumbnails", () => {
    render(<ProductCarousel productData={mockProducts[0]} />);

    const thumbnails = screen.getAllByTestId("swiper-slide");
    expect(thumbnails.length).toBe(mockProducts[0].images.length * 2);
  });

  it("renders navigation arrows", () => {
    render(<ProductCarousel productData={mockProducts[0]} />);

    expect(screen.getByTestId("icon-ChevronLeft")).toBeVisible();
    expect(screen.getByTestId("icon-ChevronRight")).toBeVisible();
  });
});

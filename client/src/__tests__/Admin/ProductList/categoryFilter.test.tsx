import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import CategoryFilter from "../../../components/shop/Admin/ProductList/CategoryFilter";
import serverAPI from "../../../helper/axios";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.mock("lucide-react", () => ({
  X: () => <div data-testid="icon-X" />,
  ChevronDown: () => <div data-testid="icon-ChevronDown" />,
}));

jest.mock("../../../helper/axios", () => ({
  get: jest.fn(),
}));

describe("CategoryFilter on Product List Page", () => {
  const mockSetSelectedCategories = jest.fn();
  const mockCategories = [
    "Dog Food",
    "Cat Food",
    "Pet Toys",
    "Pet Accessories",
    "Pet Beds",
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it("fetches and displays pet-related categories", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockCategories });

    render(
      <CategoryFilter
        selectedCategories={[]}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );
    const dropdownToggle = screen.getByText("Select categories...");
    fireEvent.click(dropdownToggle);

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/product/get-categories", {
        withCredentials: true,
      });
      expect(screen.getByText("Dog Food")).toBeVisible();
      expect(screen.getByText("Cat Food")).toBeVisible();
      expect(screen.getByText("Pet Toys")).toBeVisible();
      expect(screen.getByText("Pet Accessories")).toBeVisible();
      expect(screen.getByText("Pet Beds")).toBeVisible();
    });
  });

  it("opens and closes the dropdown on click", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockCategories });

    render(
      <CategoryFilter
        selectedCategories={[]}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );

    const dropdownToggle = screen.getByText("Select categories...");
    fireEvent.click(dropdownToggle);

    await waitFor(() => {
      expect(screen.getByText("Dog Food")).toBeVisible();
    });

    await waitFor(() => {
      userEvent.click(document.body);
      expect(screen.queryByText("Dog Food")).not.toBeInTheDocument();
    });
  });

  it("selects and deselects categories", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockCategories });

    const selectedCategories: string[] = [];
    const mockSetSelectedCategories = jest.fn((newCategories) => {
      selectedCategories.length = 0;
      selectedCategories.push(...newCategories);
    });

    render(
      <CategoryFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );
    userEvent.click(screen.getByText("Select categories..."));
    const dogFoodOption = await screen.findByText("Dog Food");
    await waitFor(() => expect(dogFoodOption).toBeVisible());
    const dogFoodCheckbox = screen.getByLabelText("Dog Food");

    fireEvent.click(dogFoodCheckbox);
    expect(mockSetSelectedCategories).toHaveBeenCalledWith(["Dog Food"]);

    selectedCategories.push("Dog Food");

    fireEvent.click(dogFoodCheckbox);
    expect(mockSetSelectedCategories).toHaveBeenCalledWith([]);
  });

  it("displays selected categories with remove buttons", async () => {
    render(
      <CategoryFilter
        selectedCategories={["Cat Food"]}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );

    expect(screen.getByText("Cat Food")).toBeVisible();
    const removeButton = screen.getByTestId("icon-X");
    fireEvent.click(removeButton);

    expect(mockSetSelectedCategories).toHaveBeenCalledWith([]);
  });

  it("closes the dropdown when clicking outside", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockCategories });

    render(
      <CategoryFilter
        selectedCategories={[]}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );
    fireEvent.click(screen.getByText("Select categories..."));

    await waitFor(() =>
      expect(screen.getByLabelText("Dog Food")).toBeVisible()
    );

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText("Dog Food")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValue(new Error("Network Error"));
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <CategoryFilter
        selectedCategories={[]}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/product/get-categories", {
        withCredentials: true,
      });
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch categories:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});

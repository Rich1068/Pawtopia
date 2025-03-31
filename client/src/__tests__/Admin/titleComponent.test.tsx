import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import "@testing-library/jest-dom";

jest.mock("lucide-react");
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

describe("TitleComponent", () => {
  it("renders the title text correctly", () => {
    render(
      <MemoryRouter>
        <TitleComponent text="Test Title" />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Title")).toBeVisible();
  });

  it("navigates back when the arrow icon is clicked", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <TitleComponent text="Test Title" />
      </MemoryRouter>
    );

    const arrowIcon = screen.getByTestId("icon-ArrowLeft");
    await userEvent.click(arrowIcon);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

import { render, screen } from "@testing-library/react";
import PetPageText from "../../components/PetPage/PetPageText";
import { mockPets } from "../../__mocks__/mockPets";
import "@testing-library/jest-dom";

describe("PetPageText Component", () => {
  test("renders pet name", () => {
    render(<PetPageText petData={mockPets[0]} />);
    expect(screen.getByTestId("pet-name")).toHaveTextContent("Kaia Carson");
  });

  test("renders pet details correctly", () => {
    render(<PetPageText petData={mockPets[0]} />);
    expect(screen.getByTestId("pet-breed")).toHaveTextContent(
      /Pit Bull Terrier/i
    );
    expect(screen.getByTestId("pet-age-group")).toHaveTextContent(/Adult/i);
    expect(screen.getByTestId("pet-sex")).toHaveTextContent(/Female/i);
    expect(screen.getByTestId("pet-size")).toHaveTextContent(/Medium/i);
    expect(screen.getByTestId("pet-coat-length")).toHaveTextContent(/Short/i);
    expect(screen.getByTestId("pet-vaccinated")).toHaveTextContent(/Yes/i);
    expect(screen.getByTestId("pet-status")).toHaveTextContent(/Available/i);
  });

  test("renders pet description correctly", () => {
    render(<PetPageText petData={mockPets[0]} />);
    expect(screen.getByTestId("pet-description")).toHaveTextContent(
      "Kaia is a sweet and friendly dog..."
    );
  });

  test("does not render anything if petData is null", () => {
    const { container } = render(<PetPageText petData={null} />);
    expect(container.firstChild).toBeNull();
  });
});

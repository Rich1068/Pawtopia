import { render, screen } from "@testing-library/react";
import AdminFooter from "../../../components/Layout/Admin/AdminFooter";
import "@testing-library/jest-dom";

describe("AdminFooter Component", () => {
  it("renders correctly when isExpanded is true", () => {
    render(<AdminFooter isExpanded={true} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeVisible();
    expect(footer).toHaveClass("md:ml-60 md:w-[calc(100%-15rem)]");
    expect(footer).toHaveTextContent(
      `© ${new Date().getFullYear()} Pawtopia. All rights reserved.`
    );
  });

  it("renders correctly when isExpanded is false", () => {
    render(<AdminFooter isExpanded={false} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeVisible();
    expect(footer).toHaveClass(
      "ml-20 w-[calc(100%-5rem) max-md:ml-0 max-md:w-0]"
    );
    expect(footer).toHaveTextContent(
      `© ${new Date().getFullYear()} Pawtopia. All rights reserved.`
    );
  });

  it("displays the correct year dynamically", () => {
    render(<AdminFooter isExpanded={true} />);

    const footer = screen.getByRole("contentinfo");
    const currentYear = new Date().getFullYear();
    expect(footer).toHaveTextContent(
      `© ${currentYear} Pawtopia. All rights reserved.`
    );
  });
});

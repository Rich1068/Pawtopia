import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductActionButtons from "../../../components/shop/Admin/ProductList/ProductActionButtons";
import { MemoryRouter } from "react-router";
import { mockProduct } from "../../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

jest.mock("lucide-react");

const setup = (
  isArchived = false,
  overrides: Partial<{
    onDelete: jest.Mock;
    onArchive: jest.Mock;
    onRecover: jest.Mock;
  }> = {}
) => {
  const onDelete = overrides.onDelete ?? jest.fn();
  const onArchive = overrides.onArchive ?? jest.fn();
  const onRecover = overrides.onRecover ?? jest.fn();

  const product = { ...mockProduct, isArchived };

  render(
    <MemoryRouter>
      <ProductActionButtons
        product={product}
        onDelete={onDelete}
        onArchive={onArchive}
        onRecover={onRecover}
      />
    </MemoryRouter>
  );

  return { onDelete, onArchive, onRecover };
};

describe("ProductActionButtons", () => {
  it("renders view and edit buttons", () => {
    setup();
    expect(screen.getByTestId("view-button")).toBeInTheDocument();
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  });

  it("shows archive button if product is not archived", () => {
    setup(false);
    expect(screen.getByTestId("archive-button")).toBeInTheDocument();
    expect(screen.queryByTestId("recover-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
  });

  it("shows recover and delete buttons if product is archived", () => {
    setup(true);
    expect(screen.getByTestId("recover-button")).toBeInTheDocument();
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    expect(screen.queryByTestId("archive-button")).not.toBeInTheDocument();
  });

  it("opens modal when archive is clicked", async () => {
    setup(false);
    fireEvent.click(screen.getByTestId("archive-button"));
    expect(await screen.findByText("Confirm Archiving")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to archive "Premium Dog Food"/)
    ).toBeInTheDocument();
  });

  it("opens modal when recover is clicked", async () => {
    setup(true);
    fireEvent.click(screen.getByTestId("recover-button"));
    expect(await screen.findByText("Confirm Recovery")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to recover "Premium Dog Food"/)
    ).toBeInTheDocument();
  });

  it("opens modal when delete is clicked", async () => {
    setup(true);
    fireEvent.click(screen.getByTestId("delete-button"));
    expect(await screen.findByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Are you sure you want to Permanently Delete "Premium Dog Food"/
      )
    ).toBeInTheDocument();
  });

  it("calls onArchive after confirming archive", async () => {
    const { onArchive } = setup(false);
    fireEvent.click(screen.getByTestId("archive-button"));
    const confirmButton = await screen.findByText("Archive");
    fireEvent.click(confirmButton);
    await waitFor(() => expect(onArchive).toHaveBeenCalledWith("1"));
  });

  it("calls onRecover after confirming recovery", async () => {
    const { onRecover } = setup(true);
    fireEvent.click(screen.getByTestId("recover-button"));
    const confirmButton = await screen.findByText("Recover");
    fireEvent.click(confirmButton);
    await waitFor(() => expect(onRecover).toHaveBeenCalledWith("1"));
  });

  it("calls onDelete after confirming delete", async () => {
    const { onDelete } = setup(true);
    fireEvent.click(screen.getByTestId("delete-button"));
    const confirmButton = await screen.findByText("Delete");
    fireEvent.click(confirmButton);
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith("1"));
  });

  describe("ProductActionButtons error handling", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("logs an error when onArchive throws", async () => {
      const errorMessage = "Archive failed";
      const onArchive = jest.fn(() => {
        throw new Error(errorMessage);
      });

      setup(false, { onArchive });

      fireEvent.click(screen.getByTestId("archive-button"));
      const confirmButton = await screen.findByText("Archive");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to archive product:",
          expect.any(Error)
        );
      });
    });

    it("logs an error when onRecover throws", async () => {
      const errorMessage = "Recover failed";
      const onRecover = jest.fn(() => {
        throw new Error(errorMessage);
      });

      setup(true, { onRecover });

      fireEvent.click(screen.getByTestId("recover-button"));
      const confirmButton = await screen.findByText("Recover");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to recover product: ",
          expect.any(Error)
        );
      });
    });

    it("logs an error when onDelete throws", async () => {
      const errorMessage = "Delete failed";
      const onDelete = jest.fn(() => {
        throw new Error(errorMessage);
      });

      setup(true, { onDelete });

      fireEvent.click(screen.getByTestId("delete-button"));
      const confirmButton = await screen.findByText("Delete");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to delete product:",
          expect.any(Error)
        );
      });
    });
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "../app/day/page";

beforeAll(() => {
  document.elementFromPoint = jest
    .fn()
    .mockReturnValue(document.createElement("div"));
});
describe("Page", () => {
  it("Element is resizable", async () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId("slot-2"));

    const draggable = screen.getByTestId("draggable-2");
    const container = screen.getByTestId("container-div-2");
    const resizable = screen.getByTestId("resizer-2");

    fireEvent.dragStart(resizable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);
    fireEvent.dragEnter(screen.getByTestId("slot-13"));

    fireEvent.dragOver(screen.getByTestId("slot-13"), {
      clientX: 0,
      clientY: 10,
    });

    fireEvent.drop(screen.getByTestId("resizer-2"));
    await waitFor(() => {
      expect(screen.getByTestId("container-div-2")).toHaveStyle(
        "grid-row: 2 / span 12; grid-column: 2; z-index: 20;",
      );
      expect(screen.getByTestId("draggable-2")).not.toHaveStyle("opacity: 0.4");
    });
    fireEvent.click(screen.getByTestId("remove-2"));
  });
  it("Element does not overlap when resizing", async () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId("slot-2"));

    fireEvent.click(screen.getByTestId("slot-4"));

    const draggable = screen.getByTestId("draggable-2");
    const container = screen.getByTestId("container-div-2");
    const resizable = screen.getByTestId("resizer-2");

    fireEvent.dragStart(resizable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);
    fireEvent.dragEnter(screen.getByTestId("slot-13"));

    fireEvent.dragOver(screen.getByTestId("slot-13"), {
      clientX: 0,
      clientY: 10,
    });

    fireEvent.drop(screen.getByTestId("resizer-2"));
    await waitFor(() => {
      expect(screen.getByTestId("container-div-2")).toHaveStyle(
        "grid-row: 2 / span 1; grid-column: 2; z-index: 20;",
      );
      expect(screen.getByTestId("draggable-2")).not.toHaveStyle("opacity: 0.4");
    });
  });
});

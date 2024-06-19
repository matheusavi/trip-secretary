import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "../app/page";

beforeAll(() => {
  document.elementFromPoint = jest
    .fn()
    .mockReturnValue(document.createElement("div"));
});
describe("Page", () => {
  it("Element is resizable", async () => {
    render(<Page />);
    const draggable = screen.getByTestId("draggable");
    const container = screen.getByTestId("container-div");
    const resizable = screen.getByTestId("resizer");

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

    fireEvent.drop(screen.getByTestId("resizer"));
    await waitFor(() => {
      expect(screen.getByTestId("container-div")).toHaveStyle(
        "grid-row: 2 / span 12; grid-column: 2; z-index: 20;",
      );
      expect(screen.getByTestId("draggable")).not.toHaveStyle("opacity: 0.4");
    });
  });
});

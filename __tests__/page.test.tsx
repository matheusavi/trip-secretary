import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Page from "../app/page";

beforeAll(() => {
  document.elementFromPoint = jest
    .fn()
    .mockReturnValue(document.createElement("div"));
});

describe("Page", () => {
  it("Renders without crashing", () => {
    render(<Page />);
    for (var i = 1; i < 25; i++) {
      expect(screen.getByText(i)).toBeInTheDocument();
    }
    expect(screen.getByTestId("title")).toBeInTheDocument();
  });

  it("Element is draggable", async () => {
    render(<Page />);
    const draggable = screen.getByTestId("draggable");
    const container = screen.getByTestId("container-div");

    fireEvent.dragStart(draggable);

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

    fireEvent.drop(screen.getByTestId("draggable"));
    await waitFor(() => {
      expect(screen.getByTestId("container-div")).toHaveStyle(
        "grid-row: 13 / span 2; grid-column: 2; z-index: 20;",
      );
      expect(screen.getByTestId("draggable")).not.toHaveStyle("opacity: 0.4");
    });
  });
  //TODO tests to drag over another
});

import {
  findByTestId,
  findByText,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Page from "../app/components/day";
import { assert } from "console";

beforeAll(() => {
  document.elementFromPoint = jest
    .fn()
    .mockReturnValue(document.createElement("div"));
});

describe("Page", () => {
  it("Renders without crashing", () => {
    render(<Page />);
    for (var i = 1; i < 25; i++) {
      expect(screen.getByTestId("hour-" + i)).toBeInTheDocument();
    }
    expect(screen.getByTestId("title")).toBeInTheDocument();
  });

  it("Element is draggable", async () => {
    render(<Page />);

    await new Promise((r) => setTimeout(r, 200));

    fireEvent.click(screen.getByTestId("slot-2"));

    const draggable = screen.getByTestId("draggable-2");

    fireEvent.dragStart(draggable);

    await waitFor(() => {
      const container = screen.getByTestId("container-div-2");
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);
    fireEvent.dragEnter(screen.getByTestId("slot-13"));

    fireEvent.dragOver(screen.getByTestId("slot-13"), {
      clientX: 0,
      clientY: 10,
    });

    fireEvent.drop(screen.getByTestId("draggable-2"));
    await waitFor(() => {
      expect(screen.getByTestId("container-div-13")).toHaveStyle(
        "grid-row: 13 / span 1; grid-column: 2; z-index: 20;",
      );
      expect(screen.getByTestId("draggable-13")).not.toHaveStyle(
        "opacity: 0.4",
      );
      fireEvent.click(screen.getByTestId("remove-13"));
    });
  }, 60000);
  it("Cant create two elements at same slot", async () => {
    render(<Page />);

    fireEvent.click(screen.getByTestId("slot-2"));
    fireEvent.click(screen.getByTestId("slot-2"));
    expect(
      document.getElementsByClassName("compromise-container"),
    ).toHaveLength(1);
  });
});

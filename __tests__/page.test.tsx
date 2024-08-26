import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../app/components/day";
import { Compromise } from "@/app/components/compromise/compromise";
import { v4 as uuidv4 } from "uuid";
import { today, getLocalTimeZone } from "@internationalized/date";

beforeAll(() => {
  document.elementFromPoint = jest
    .fn()
    .mockReturnValue(document.createElement("div"));
});

afterEach(async () => {
  fireEvent.dragEnd(window);
  fireEvent.pointerMove(window);
});

jest.mock("@/lib/server/appwrite", () => ({
  getCompromisesForTheDate: jest.fn().mockImplementation((date) => {
    const initialCompromise = new Compromise();

    initialCompromise.id = uuidv4();
    initialCompromise.index = 2;
    initialCompromise.plan = "My plan";
    initialCompromise.costs = 20;
    initialCompromise.resolved = false;
    initialCompromise.size = 1;
    initialCompromise.date = today(getLocalTimeZone()).toString();

    const initialCompromise2 = new Compromise();

    initialCompromise2.id = uuidv4();
    initialCompromise2.index = 14;
    initialCompromise2.plan = "My plan";
    initialCompromise2.costs = 20;
    initialCompromise2.resolved = false;
    initialCompromise2.size = 1;
    initialCompromise2.date = today(getLocalTimeZone()).toString();

    console.log("getCompromisesForTheDate called with date:", date);
    return Promise.resolve([initialCompromise, initialCompromise2]);
  }),
  upsertCompromise: jest.fn(),
}));

describe("Page", () => {
  it("Element is resizable", async () => {
    render(<Page />);

    await new Promise((r) => setTimeout(r, 50));

    screen.logTestingPlaygroundURL(document.body);

    const container = screen.getByTestId("container-div-2");
    const draggable = screen.getByTestId("draggable-2");
    const resizable = screen.getByTestId("resizer-2");

    fireEvent.dragStart(resizable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);

    fireEvent.dragEnter(screen.getByTestId("slot-13"));

    fireEvent.dragOver(screen.getByTestId("slot-13"), {
      clientX: 10,
      clientY: 0,
    });

    fireEvent.drop(resizable);

    await waitFor(() => {
      expect(screen.getByTestId("container-div-2")).toHaveStyle(
        "grid-row: 2 / span 12; grid-column: 2; z-index: 20;",
      );
      expect(screen.getByTestId("draggable-2")).not.toHaveStyle("opacity: 0.4");
    });
  });

  it("Element does not overlap when resizing", async () => {
    render(<Page />);

    await new Promise((r) => setTimeout(r, 50));

    const draggable = screen.getByTestId("draggable-2");
    const container = screen.getByTestId("container-div-2");
    const resizable = screen.getByTestId("resizer-2");

    fireEvent.dragStart(resizable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);
    fireEvent.dragEnter(screen.getByTestId("slot-20"));

    fireEvent.dragOver(screen.getByTestId("slot-20"), {
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
  it("Element is draggable", async () => {
    render(<Page />);

    await new Promise((r) => setTimeout(r, 50));

    const draggable = screen.getByTestId("draggable-14");

    fireEvent.dragStart(draggable);

    await waitFor(() => {
      const container = screen.getByTestId("container-div-14");
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);
    fireEvent.dragEnter(screen.getByTestId("slot-22"));

    fireEvent.dragOver(screen.getByTestId("slot-22"), {
      clientX: 0,
      clientY: 10,
    });

    fireEvent.drop(screen.getByTestId("draggable-14"));
    await waitFor(() => {
      expect(screen.getByTestId("container-div-22")).toHaveStyle(
        "grid-row: 22 / span 1; grid-column: 2; z-index: 20;",
      );
      expect(screen.getByTestId("draggable-22")).not.toHaveStyle(
        "opacity: 0.4",
      );
    });
  });

  it("Create element", async () => {
    render(<Page />);

    await new Promise((r) => setTimeout(r, 50));

    const slot = screen.getByTestId("slot-16");

    fireEvent.click(slot);

    await waitFor(() => {
      expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
    });

    const textArea = screen.getByRole("textbox", { name: /plan/i });
    const textContent = "I want to eat bananas";
    await userEvent.type(textArea, textContent);

    const costsInput = screen.getByRole("textbox", { name: /costs/i });
    await userEvent.type(costsInput, "25");

    screen.logTestingPlaygroundURL(screen.getByTestId("form-16"));

    fireEvent.click(screen.getByText(/Save changes/i));

    await waitFor(() => {
      expect(screen.getByTestId("plan-16")).toHaveTextContent(textContent);
      expect(screen.getByTestId("costs-16")).toHaveTextContent("$25");
    });
  });
});

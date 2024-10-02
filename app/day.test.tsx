import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Day from "../app/components/day";
import { Compromise } from "@/app/components/compromise/compromise";
import { v4 as uuidv4 } from "uuid";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Provider } from "jotai";

beforeAll(() => {
  document.elementFromPoint = jest
    .fn()
    .mockReturnValue(document.createElement("div"));
});

afterEach(async () => {
  fireEvent.dragEnd(window);
  fireEvent.pointerMove(window);
});

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

jest.mock("@/lib/server/appwrite", () => ({
  getCompromisesForTheDate: jest.fn().mockImplementation((date) => {
    console.log("getCompromisesForTheDate called with date:", date);
    return Promise.resolve([initialCompromise, initialCompromise2]);
  }),
  upsertCompromise: jest.fn(),
  deleteCompromise: jest.fn(),
}));

jest.mock("@/lib/server/oauth", () => ({
  signUpWithGoogle: jest.fn(),
}));

const DayProvider = () => (
  <Provider>
    <Day
      userData={{ name: "Doe" }}
      compromisesFromServer={[initialCompromise, initialCompromise2]}
      date={null}
    />
  </Provider>
);

describe("Page", () => {
  it("Element is resizable", async () => {
    render(<DayProvider />);

    const container = await screen.findByTestId("container-div-2");
    const draggable = await screen.findByTestId("draggable-2");
    const resizable = await screen.findByTestId("resizer-2");

    fireEvent.dragStart(resizable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);

    fireEvent.dragEnter(await screen.findByTestId("slot-13"));

    fireEvent.dragOver(await screen.findByTestId("slot-13"), {
      clientX: 10,
      clientY: 0,
    });

    fireEvent.drop(resizable);

    await waitFor(async () => {
      expect(await screen.findByTestId("container-div-2")).toHaveStyle(
        "grid-row: 2 / span 12; grid-column: 2; z-index: 20;",
      );
      expect(await screen.findByTestId("draggable-2")).not.toHaveStyle(
        "opacity: 0.4",
      );
    });
  });

  it("Element does not overlap when resizing", async () => {
    render(<DayProvider />);

    const draggable = await screen.findByTestId("draggable-2");
    const container = await screen.findByTestId("container-div-2");
    const resizable = await screen.findByTestId("resizer-2");

    fireEvent.dragStart(resizable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);
    fireEvent.dragEnter(await screen.findByTestId("slot-20"));

    fireEvent.dragOver(await screen.findByTestId("slot-20"), {
      clientX: 0,
      clientY: 10,
    });

    fireEvent.drop(await screen.findByTestId("resizer-2"));
    await waitFor(async () => {
      expect(await screen.findByTestId("container-div-2")).toHaveStyle(
        "grid-row: 2 / span 1; grid-column: 2; z-index: 20;",
      );
      expect(await screen.findByTestId("draggable-2")).not.toHaveStyle(
        "opacity: 0.4",
      );
    });
  });
  it("Element is draggable", async () => {
    render(<DayProvider />);

    const draggable = await screen.findByTestId("draggable-14");

    fireEvent.dragStart(draggable);

    await waitFor(async () => {
      const container = await screen.findByTestId("container-div-14");
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.dragEnter(document.body);
    fireEvent.dragEnter(await screen.findByTestId("slot-22"));

    fireEvent.dragOver(await screen.findByTestId("slot-22"), {
      clientX: 0,
      clientY: 10,
    });

    fireEvent.drop(await screen.findByTestId("draggable-14"));
    await waitFor(async () => {
      expect(await screen.findByTestId("container-div-22")).toHaveStyle(
        "grid-row: 22 / span 1; grid-column: 2; z-index: 20;",
      );
      expect(await screen.findByTestId("draggable-22")).not.toHaveStyle(
        "opacity: 0.4",
      );
    });
  });

  it("Element is creatable", async () => {
    render(<DayProvider />);

    const slot = await screen.findByTestId("slot-16");

    fireEvent.click(slot);

    await waitFor(() => {
      expect(screen.getByText(/Save changes/i)).toBeInTheDocument();
    });

    const textArea = screen.getByRole("textbox", { name: /plan/i });
    const textContent = "I want to eat bananas";
    await userEvent.type(textArea, textContent);

    const costsInput = screen.getByRole("textbox", { name: /costs/i });
    await userEvent.type(costsInput, "25");

    fireEvent.click(screen.getByText(/Save changes/i));

    await waitFor(async () => {
      expect(await screen.findByTestId("plan-16")).toHaveTextContent(
        textContent,
      );
      expect(await screen.findByTestId("costs-16")).toHaveTextContent("$25");
    });
  });

  it("Element is deletable", async () => {
    render(<DayProvider />);

    const button = await screen.findByRole("button", {
      name: /compromise 2 actions/i,
    });

    await userEvent.click(button);

    const deleteButton = await screen.findByRole("menuitem", {
      name: /delete compromise 2/i,
    });

    const container = await screen.findByTestId("container-div-2");

    await userEvent.click(deleteButton);

    await waitFor(async () => {
      expect(container).not.toBeInTheDocument();
    });
  });
});

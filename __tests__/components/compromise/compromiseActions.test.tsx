import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import CompromiseContainer from "@/app/components/compromise/compromiseContainer";
import { Compromise } from "@/app/components/compromise/compromise";
import {
  compromisesAtom,
  userIsLoggedInAtom,
} from "@/app/components/compromise/compromiseAtom";
import { useMediaQuery } from "@/components/hooks/useMediaQuery";
import { upsertCompromise } from "@/lib/server/appwrite";

const useMediaQueryMock = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>;
const upsertCompromiseMock = upsertCompromise as jest.MockedFunction<
  typeof upsertCompromise
>;

function buildCompromise(): Compromise {
  const compromise = new Compromise();
  compromise.id = "compromise-1";
  compromise.index = 2;
  compromise.plan = "Visit the museum";
  compromise.costs = 20;
  compromise.resolved = false;
  compromise.size = 2;
  compromise.date = "2026-09-30";
  return compromise;
}

// Exposes the atom content so tests can assert on the state, not only the UI.
let latestCompromises: Compromise[] = [];
const AtomProbe = () => {
  latestCompromises = useAtomValue(compromisesAtom);
  return null;
};

const Hydrate = ({ compromise }: { compromise: Compromise }) => {
  useHydrateAtoms([
    [compromisesAtom, [compromise]],
    [userIsLoggedInAtom, true],
  ] as const);
  return (
    <>
      <CompromiseContainer id={compromise.id} />
      <AtomProbe />
    </>
  );
};

function renderCompromise(compromise = buildCompromise()) {
  render(
    <Provider>
      <Hydrate compromise={compromise} />
    </Provider>,
  );
  return compromise;
}

async function openAction(action: "View" | "Edit", index = 2) {
  await userEvent.click(
    screen.getByRole("button", { name: `Compromise ${index} actions` }),
  );
  await userEvent.click(
    await screen.findByRole("menuitem", {
      name: `${action} compromise ${index}`,
    }),
  );
  return screen.findByRole("dialog");
}

// vaul (the mobile Drawer) handles pointer events with APIs jsdom lacks
// (setPointerCapture, computed transforms), so inside the dialog we replace
// the field content from the keyboard instead of clicking into it, and press
// buttons with a plain click event.
async function replaceText(element: HTMLElement, text: string) {
  const field = element as HTMLInputElement | HTMLTextAreaElement;
  field.focus();
  field.setSelectionRange(0, field.value.length);
  await userEvent.type(field, text, { skipClick: true });
}

beforeEach(() => {
  latestCompromises = [];
});

describe.each([
  ["desktop", true],
  ["mobile", false],
])("Compromise actions on %s", (_, isDesktop) => {
  beforeEach(() => {
    useMediaQueryMock.mockReturnValue(isDesktop);
  });

  it("Edit opens the form prefilled with the current values", async () => {
    renderCompromise();

    const dialog = await openAction("Edit");

    expect(within(dialog).getByText("Edit plan")).toBeInTheDocument();
    expect(within(dialog).getByRole("textbox", { name: /plan/i })).toHaveValue(
      "Visit the museum",
    );
    expect(within(dialog).getByRole("textbox", { name: /costs/i })).toHaveValue(
      "$20",
    );
    expect(
      within(dialog).getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("Saving an edit updates the same compromise without creating a new one", async () => {
    const original = renderCompromise();

    const dialog = await openAction("Edit");
    const plan = within(dialog).getByRole("textbox", { name: /plan/i });
    await replaceText(plan, "Visit the zoo");
    const costs = within(dialog).getByRole("textbox", { name: /costs/i });
    await replaceText(costs, "35");

    fireEvent.click(
      within(dialog).getByRole("button", { name: /save changes/i }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByTestId("plan-2")).toHaveTextContent("Visit the zoo");
    expect(screen.getByTestId("costs-2")).toHaveTextContent("$35");

    expect(latestCompromises).toHaveLength(1);
    expect(latestCompromises[0]).toMatchObject({
      id: original.id,
      index: original.index,
      size: original.size,
      date: original.date,
      plan: "Visit the zoo",
      costs: 35,
    });

    // Persisted through the storage layer (debounced) as an upsert of the same id.
    await waitFor(() => expect(upsertCompromiseMock).toHaveBeenCalledTimes(1), {
      timeout: 3000,
    });
    expect(upsertCompromiseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: original.id,
        index: original.index,
        size: original.size,
        date: original.date,
        plan: "Visit the zoo",
        costs: 35,
      }),
    );
  });

  it("Cancelling an edit leaves the compromise unchanged", async () => {
    const original = renderCompromise();

    const dialog = await openAction("Edit");
    const plan = within(dialog).getByRole("textbox", { name: /plan/i });
    await replaceText(plan, "Something else");

    // Desktop: the Dialog's close (X) button. Mobile: the Drawer's Cancel button.
    fireEvent.click(
      within(dialog).getByRole("button", {
        name: isDesktop ? /close/i : /cancel/i,
      }),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByTestId("plan-2")).toHaveTextContent("Visit the museum");
    expect(latestCompromises).toEqual([original]);

    // Re-opening shows the stored values again, not the discarded draft.
    const reopened = await openAction("Edit");
    expect(
      within(reopened).getByRole("textbox", { name: /plan/i }),
    ).toHaveValue("Visit the museum");

    await act(() => new Promise((resolve) => setTimeout(resolve, 1200)));
    expect(upsertCompromiseMock).not.toHaveBeenCalled();
  });

  it("View shows the compromise read-only without a save button", async () => {
    renderCompromise();

    const dialog = await openAction("View");

    expect(within(dialog).getByText("View plan")).toBeInTheDocument();
    const plan = within(dialog).getByRole("textbox", { name: /plan/i });
    const costs = within(dialog).getByRole("textbox", { name: /costs/i });
    expect(plan).toHaveValue("Visit the museum");
    expect(plan).toHaveAttribute("readonly");
    expect(costs).toHaveValue("$20");
    expect(costs).toHaveAttribute("readonly");
    expect(
      within(dialog).queryByRole("button", { name: /save changes/i }),
    ).not.toBeInTheDocument();

    await replaceText(plan, "typed text");
    expect(plan).toHaveValue("Visit the museum");
  });
});

describe("Compromise actions and dragging", () => {
  beforeEach(() => {
    useMediaQueryMock.mockReturnValue(true);
  });

  afterEach(() => {
    fireEvent.dragEnd(window);
    fireEvent.pointerMove(window);
  });

  it("Does not start a drag while the actions menu is open", async () => {
    renderCompromise();

    await userEvent.click(
      screen.getByRole("button", { name: "Compromise 2 actions" }),
    );
    await screen.findByRole("menu");

    const draggable = screen.getByTestId("draggable-2");
    const container = screen.getByTestId("container-div-2");
    fireEvent.dragStart(draggable);
    fireEvent.dragStart(screen.getByTestId("resizer-2"));
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));

    expect(container).toHaveStyle("z-index: 20");
    expect(draggable).not.toHaveStyle("opacity: 0.4");
  });

  it("Does not start a drag while the edit dialog is open, and drags again once it closes", async () => {
    renderCompromise();

    await openAction("Edit");

    const draggable = screen.getByTestId("draggable-2");
    const container = screen.getByTestId("container-div-2");
    fireEvent.dragStart(draggable);
    await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
    expect(container).toHaveStyle("z-index: 20");

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );

    fireEvent.dragStart(draggable);
    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });
    fireEvent.drop(draggable);
    expect(container).toHaveStyle("z-index: 20");
  });
});

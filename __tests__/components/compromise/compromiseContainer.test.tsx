import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompromiseContainer from "../../../app/components/compromise/compromiseContainer";
import { useHydrateAtoms } from "jotai/utils";
import { Compromise } from "@/app/components/compromise/compromise";
import { Provider } from "jotai";
import { ReactNode } from "react";
import { compromisesAtom } from "@/app/components/compromise/compromiseAtom";

describe("CompromiseContainer", () => {
  const initialCompromise = new Compromise();

  initialCompromise.index = 2;
  initialCompromise.plan = "My plan";
  initialCompromise.costs = 20;
  initialCompromise.resolved = false;
  initialCompromise.size = 2;

  const HydrateAtoms = ({
    initialValues,
    children,
  }: {
    initialValues: [[typeof compromisesAtom, Compromise[]]];
    children: ReactNode;
  }) => {
    useHydrateAtoms(initialValues);
    return children;
  };

  const TestProvider = ({
    initialValues,
    children,
  }: {
    initialValues: [[typeof compromisesAtom, Compromise[]]];
    children: ReactNode;
  }) => (
    <Provider>
      <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
  );
  const CompromiseProvider = () => {
    return (
      <TestProvider initialValues={[[compromisesAtom, [initialCompromise]]]}>
        <CompromiseContainer id={initialCompromise.id} />
      </TestProvider>
    );
  };

  it("Renders without crashing", () => {
    render(<CompromiseProvider />);
    expect(screen.getByPlaceholderText("Day plan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Costs")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("draggable-2")).toBeInTheDocument();
    expect(screen.getByTestId("resizer-2")).toBeInTheDocument();
  });

  it("Element is draggable", async () => {
    render(<CompromiseProvider />);
    const draggable = screen.getByTestId("draggable-2");
    const container = screen.getByTestId("container-div-2");
    fireEvent.dragStart(draggable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.drop(draggable);
    expect(container).toHaveStyle("z-index: 20");
    expect(draggable).not.toHaveStyle("opacity: 0.4");
  });

  it("Element is resizable", async () => {
    render(<CompromiseProvider />);
    const resizable = screen.getByTestId("resizer-2");
    const draggable = screen.getByTestId("draggable-2");
    const container = screen.getByTestId("container-div-2");
    fireEvent.dragStart(resizable);

    await waitFor(() => {
      expect(container).toHaveStyle("z-index: 5");
      expect(draggable).toHaveStyle("opacity: 0.4");
    });

    fireEvent.drop(resizable);
    expect(container).toHaveStyle("z-index: 20");
    expect(draggable).not.toHaveStyle("opacity: 0.4");
  });

  it("Elements are editable", async () => {
    render(<CompromiseProvider />);
    const plan = screen.getByPlaceholderText("Day plan");
    const costs = screen.getByPlaceholderText("Costs");
    const checkbox = screen.getByTestId("checkbox");
    await userEvent.type(plan, " is to eat bananas");
    await userEvent.type(costs, "10.23");
    await userEvent.click(checkbox);

    expect(plan).toHaveValue("My plan is to eat bananas");
    expect(costs).toHaveValue("$2010.23");
    expect(checkbox).toBeChecked();
  });
});

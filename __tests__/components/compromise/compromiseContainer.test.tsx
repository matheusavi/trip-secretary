import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompromiseContainer from "../../../app/components/compromise/compromiseContainer";

describe("CompromiseContainer", () => {
  it("Renders without crashing", () => {
    render(<CompromiseContainer id={256} />);
    expect(screen.getByPlaceholderText("Day plan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Costs")).toBeInTheDocument();
    expect(screen.getByTestId("checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("draggable")).toBeInTheDocument();
    expect(screen.getByTestId("resizer")).toBeInTheDocument();
  });

  it("Element is draggable", async () => {
    render(<CompromiseContainer id={256} />);
    const draggable = screen.getByTestId("draggable");
    const container = screen.getByTestId("container-div");
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
    render(<CompromiseContainer id={256} />);
    const resizable = screen.getByTestId("resizer");
    const draggable = screen.getByTestId("draggable");
    const container = screen.getByTestId("container-div");
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
    render(<CompromiseContainer id={256} />);
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

import { render } from "@testing-library/react";
import Day from "../../app/components/day";

it("renders day unchanged", () => {
  const { container } = render(<Day day={1} />);
  expect(container).toMatchSnapshot();
});

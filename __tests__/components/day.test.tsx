import { render } from "@testing-library/react";
import Hour from "../../app/components/day";

it("renders day unchanged", () => {
  const { container } = render(<Hour day={1} />);
  expect(container).toMatchSnapshot();
});

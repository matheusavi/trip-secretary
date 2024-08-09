import { render } from "@testing-library/react";
import Hour from "../../app/components/hour";

it("renders day unchanged", () => {
  const { container } = render(<Hour hour={1} />);
  expect(container).toMatchSnapshot();
});

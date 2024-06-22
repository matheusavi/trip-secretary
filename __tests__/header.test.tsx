import { render } from "@testing-library/react";
import Header from "../app/header";

it("renders header unchanged", () => {
  const { container } = render(<Header />);
  expect(container).toMatchSnapshot();
});

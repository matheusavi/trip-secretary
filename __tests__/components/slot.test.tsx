import { render } from "@testing-library/react";
import Slot from "../../app/components/slot";

it("renders slot unchanged", () => {
  const { container } = render(<Slot location={1} />);
  expect(container).toMatchSnapshot();
});

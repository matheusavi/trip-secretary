import { render } from "@testing-library/react";
import Header from "../app/header";

jest.mock("@/lib/server/oauth", () => ({
  signUpWithGoogle: jest.fn(),
}));

it("renders header unchanged", () => {
  const { container } = render(<Header userData={null} />);
  expect(container).toMatchSnapshot();
});

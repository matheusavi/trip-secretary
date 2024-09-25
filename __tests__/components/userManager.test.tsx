import { userIsLoggedInAtom } from "@/app/components/compromise/compromiseAtom";
import UserManager from "@/app/components/userManager";
import { logOutUser } from "@/lib/server/appwrite";
import { signUpWithGoogle } from "@/lib/server/oauth";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useHydrateAtoms } from "jotai/utils";
import { CompromiseDbFactory } from "@/lib/dbFactory";
import ServerCompromiseStorage from "@/lib/serverCompromiseStorage";

jest.mock("@/lib/server/oauth", () => ({
  signUpWithGoogle: jest.fn(),
}));

jest.mock("@/lib/server/appwrite", () => ({
  getCompromisesForTheDate: jest.fn().mockImplementation((date) => {
    console.log("getCompromisesForTheDate called with date:", date);
    return Promise.resolve([]);
  }),
  logOutUser: jest.fn(),
}));

CompromiseDbFactory.getCompromiseDb = jest
  .fn()
  .mockImplementation(() => new ServerCompromiseStorage());

describe("UserManager", () => {
  const UserManagerProvider = ({ userName }: { userName: string | null }) => {
    useHydrateAtoms([[userIsLoggedInAtom, true]]);
    return <UserManager userName={userName} />;
  };

  it("Renders without crashing", async () => {
    render(<UserManagerProvider userName={null} />);

    const menuTrigger = await screen.findByTestId("dropdown-menu-trigger");
    expect(menuTrigger).toBeInTheDocument();
  });

  it("When user is not provided, should show Anonymous user label", async () => {
    render(<UserManagerProvider userName={null} />);

    const menuTrigger = await screen.findByTestId("dropdown-menu-trigger");

    userEvent.click(menuTrigger);

    expect(await screen.findByText(/anonymous user/i));
  });

  it("When user is provided, should show userName label", async () => {
    const userName = "Jailson Mendes";
    render(<UserManagerProvider userName={userName} />);

    const menuTrigger = await screen.findByTestId("dropdown-menu-trigger");

    userEvent.click(menuTrigger);

    expect(await screen.findByText(userName));
  });

  it("When user clicks on the login button, calls login method", async () => {
    render(<UserManagerProvider userName={null} />);

    userEvent.click(await screen.findByTestId("dropdown-menu-trigger"));

    userEvent.click(await screen.findByText(/sign in with google/i));

    await waitFor(() => {
      expect(signUpWithGoogle).toHaveBeenCalled();
    });
  });

  it("When user clicks on the logout button, calls logout method", async () => {
    render(<UserManagerProvider userName={"Jailson"} />);

    userEvent.click(await screen.findByTestId("dropdown-menu-trigger"));

    userEvent.click(await screen.findByText(/log out/i));

    await waitFor(() => {
      expect(logOutUser).toHaveBeenCalled();
    });
  });
});

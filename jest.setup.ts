import "@testing-library/jest-dom";
import "@atlaskit/pragmatic-drag-and-drop-unit-testing/drag-event-polyfill";

jest.mock("@/components/hooks/useMediaQuery", () => ({
  useMediaQuery: jest.fn().mockResolvedValue(true),
}));

jest.mock("@/lib/server/appwrite", () => ({
  upsertCompromise: jest.fn().mockImplementation((...args) => {
    console.log("upsertCompromise called with args:", args);
  }),
  createSessionClient: jest.fn().mockResolvedValue({
    get account() {
      return {
        get: jest.fn().mockImplementation(() => {
          console.log("account.get called");
          return Promise.resolve({ $id: "user-id" });
        }),
      };
    },
  }),
  createAdminClient: jest.fn().mockResolvedValue({
    get account() {
      return {
        get: jest.fn().mockImplementation(() => {
          console.log("admin account.get called");
          return Promise.resolve({ $id: "admin-id" });
        }),
      };
    },
  }),
  getLoggedInUser: jest.fn().mockImplementation(() => {
    console.log("getLoggedInUser called");
    return Promise.resolve({ $id: "user-id" });
  }),
  getCompromisesForTheDate: jest.fn().mockImplementation((date) => {
    console.log("getCompromisesForTheDate called with date:", date);
    return Promise.resolve([]);
  }),
}));
beforeEach(() => {
  jest.clearAllMocks();
});

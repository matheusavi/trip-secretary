import "@testing-library/jest-dom";
import "@atlaskit/pragmatic-drag-and-drop-unit-testing/drag-event-polyfill";

jest.mock("@/lib/server/appwrite", () => ({
  upsertCompromise: jest.fn(),
  createSessionClient: jest.fn().mockResolvedValue({
    get account() {
      return {
        get: jest.fn().mockResolvedValue({ $id: "user-id" }),
      };
    },
  }),
  createAdminClient: jest.fn().mockResolvedValue({
    get account() {
      return {
        get: jest.fn().mockResolvedValue({ $id: "admin-id" }),
      };
    },
  }),
  getLoggedInUser: jest.fn().mockResolvedValue({ $id: "user-id" }),
  getCompromisesForTheDate: jest.fn().mockResolvedValue([]),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

import "@testing-library/jest-dom";
import "@atlaskit/pragmatic-drag-and-drop-unit-testing/drag-event-polyfill";
import "@atlaskit/pragmatic-drag-and-drop-unit-testing/dom-rect-polyfill";

jest.mock("@/components/hooks/useMediaQuery", () => ({
  useMediaQuery: jest.fn().mockResolvedValue(true),
}));

process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT = "http://localhost/v1";
process.env.NEXT_PUBLIC_APPWRITE_PROJECT = "project_id";
process.env.NEXT_APPWRITE_DATABASE = "database_id";
process.env.NEXT_APPWRITE_COMPROMISES = "compromises_collection_id";

beforeEach(() => {
  jest.clearAllMocks();
});

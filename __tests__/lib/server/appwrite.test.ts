/**
 * @jest-environment node
 */
import { AppwriteException, Databases, Models } from "node-appwrite";
import { cookies } from "next/headers";
import {
  createSessionClient,
  getLoggedInUser,
} from "@/lib/server/serverOnlyAppwriteActions";

// jest.setup.ts mocks the server actions for the UI tests; here we test the real module.
jest.unmock("@/lib/server/appwrite");

jest.mock("@/lib/server/serverOnlyAppwriteActions", () => ({
  getLoggedInUser: jest.fn(),
  createSessionClient: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

const {
  deleteCompromise,
  getCompromisesForTheDate,
  getLoggedUserData,
  logOutUser,
  upsertCompromise,
} = jest.requireActual<typeof import("@/lib/server/appwrite")>(
  "@/lib/server/appwrite",
);

const getLoggedInUserMock = getLoggedInUser as jest.MockedFunction<any>;
const createSessionClientMock = createSessionClient as jest.MockedFunction<any>;
const cookiesMock = cookies as jest.MockedFunction<any>;

const user = { $id: "my-user-id", name: "Matheus" };
const anotherUser = { $id: "another-user-id", name: "Someone else" };

const storedDocument = {
  id: "1",
  $id: "1",
  user: user.$id,
  plan: "Visit the museum",
  $collectionId: "",
  $databaseId: "database1",
  $createdAt: "2024-09-29T12:00:00Z",
  $updatedAt: "2024-09-29T13:00:00Z",
  $permissions: [],
} as unknown as Models.Document;

const notFound = () => new AppwriteException("Document not found", 404);

let getDocument: jest.SpyInstance;
let updateDocument: jest.SpyInstance;
let createDocument: jest.SpyInstance;
let deleteDocument: jest.SpyInstance;
let listDocuments: jest.SpyInstance;

beforeEach(() => {
  jest.restoreAllMocks();
  getDocument = jest
    .spyOn(Databases.prototype, "getDocument")
    .mockResolvedValue(storedDocument);
  updateDocument = jest
    .spyOn(Databases.prototype, "updateDocument")
    .mockResolvedValue(storedDocument);
  createDocument = jest
    .spyOn(Databases.prototype, "createDocument")
    .mockResolvedValue(storedDocument);
  deleteDocument = jest
    .spyOn(Databases.prototype, "deleteDocument")
    .mockResolvedValue({});
  listDocuments = jest
    .spyOn(Databases.prototype, "listDocuments")
    .mockResolvedValue({ total: 1, documents: [storedDocument] });
  getLoggedInUserMock.mockResolvedValue(user);
});

describe("getCompromisesForTheDate", () => {
  it("Returns the compromises of the logged in user for the date", async () => {
    const result = await getCompromisesForTheDate("2026-09-30");

    expect(result).toEqual([storedDocument]);
    expect(listDocuments).toHaveBeenCalledTimes(1);
  });

  it("Throws when there is no logged in user", async () => {
    getLoggedInUserMock.mockResolvedValue(null);

    await expect(getCompromisesForTheDate("2026-09-30")).rejects.toThrow();
  });
});

describe("upsertCompromise", () => {
  const edited = () => ({ id: "1", plan: "Visit the zoo", costs: 35 });

  it("Updates the compromise when it exists and belongs to the user", async () => {
    await upsertCompromise(edited());

    expect(getDocument).toHaveBeenCalledWith(
      process.env.NEXT_APPWRITE_DATABASE,
      process.env.NEXT_APPWRITE_COMPROMISES,
      "1",
    );
    expect(updateDocument).toHaveBeenCalledWith(
      process.env.NEXT_APPWRITE_DATABASE,
      process.env.NEXT_APPWRITE_COMPROMISES,
      "1",
      expect.objectContaining({
        id: "1",
        plan: "Visit the zoo",
        costs: 35,
        user: user.$id,
      }),
    );
    expect(createDocument).not.toHaveBeenCalled();
  });

  it("Refuses to update a compromise that belongs to another user", async () => {
    getLoggedInUserMock.mockResolvedValue(anotherUser);

    await expect(upsertCompromise(edited())).rejects.toThrow(
      "User trying to edit a register for another user",
    );
    expect(updateDocument).not.toHaveBeenCalled();
    expect(createDocument).not.toHaveBeenCalled();
  });

  it("Creates the compromise when it does not exist", async () => {
    getDocument.mockRejectedValue(notFound());

    await upsertCompromise(edited());

    expect(updateDocument).not.toHaveBeenCalled();
    expect(createDocument).toHaveBeenCalledWith(
      process.env.NEXT_APPWRITE_DATABASE,
      process.env.NEXT_APPWRITE_COMPROMISES,
      "1",
      expect.objectContaining({ id: "1", user: user.$id }),
    );
  });

  it("Logs other Appwrite errors without writing", async () => {
    const error = new AppwriteException("Server error", 500);
    getDocument.mockRejectedValue(error);
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await upsertCompromise(edited());

    expect(consoleError).toHaveBeenCalledWith(error);
    expect(updateDocument).not.toHaveBeenCalled();
    expect(createDocument).not.toHaveBeenCalled();
  });
});

describe("deleteCompromise", () => {
  it("Deletes the compromise when it belongs to the user", async () => {
    await deleteCompromise("1");

    expect(deleteDocument).toHaveBeenCalledWith(
      process.env.NEXT_APPWRITE_DATABASE,
      process.env.NEXT_APPWRITE_COMPROMISES,
      "1",
    );
  });

  it("Refuses to delete a compromise that belongs to another user", async () => {
    getLoggedInUserMock.mockResolvedValue(anotherUser);

    await expect(deleteCompromise("1")).rejects.toThrow(
      "User trying to edit a register for another user",
    );
    expect(deleteDocument).not.toHaveBeenCalled();
  });

  it("Throws when the compromise does not exist", async () => {
    getDocument.mockRejectedValue(notFound());

    await expect(deleteCompromise("1")).rejects.toThrow();
    expect(deleteDocument).not.toHaveBeenCalled();
  });
});

describe("logOutUser", () => {
  it("Deletes the session cookie and the current session", async () => {
    const deleteSession = jest.fn();
    const deleteCookie = jest.fn();
    createSessionClientMock.mockResolvedValue({
      account: { deleteSession },
    });
    cookiesMock.mockResolvedValue({ delete: deleteCookie });

    await logOutUser();

    expect(deleteCookie).toHaveBeenCalledWith("my-custom-session");
    expect(deleteSession).toHaveBeenCalledWith("current");
  });

  it("Throws a friendly error when logging out fails", async () => {
    createSessionClientMock.mockRejectedValue(new Error("No session"));
    jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(logOutUser()).rejects.toThrow(
      "It was not possible to log out",
    );
  });
});

describe("getLoggedUserData", () => {
  it("Returns only the name of the logged in user", async () => {
    await expect(getLoggedUserData()).resolves.toEqual({ name: "Matheus" });
  });

  it("Returns null when there is no logged in user", async () => {
    getLoggedInUserMock.mockResolvedValue(null);

    await expect(getLoggedUserData()).resolves.toBeNull();
  });
});

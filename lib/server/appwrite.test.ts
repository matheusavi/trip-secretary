import { AppwriteException, Databases } from "node-appwrite";
import { getCompromisesForTheDate, upsertCompromise } from "./appwrite";
import { getLoggedInUser } from "./serverOnlyAppwriteActions";

const mockDocuments = {
  documents: [
    {
      id: "1",
      $id: "1",
      user: "my-user-id",
      title: "Mock Document 1",
      $collectionId: "",
      $databaseId: "database1",
      $createdAt: "2024-09-29T12:00:00Z",
      $updatedAt: "2024-09-29T13:00:00Z",
      $permissions: [],
    },
  ],
  total: 2,
};

const user = {
  $id: "my-user-id",
};

jest
  .spyOn(Databases.prototype, "listDocuments")
  .mockResolvedValue(mockDocuments);

jest.mock("@/lib/server/serverOnlyAppwriteActions", () => ({
  getLoggedInUser: jest.fn(),
}));

const getLoggedInUserMock = getLoggedInUser as jest.MockedFunction<any>;

describe("getCompromisesForTheDate", () => {
  it("Should retrive compromises when passing a date", async () => {
    getLoggedInUserMock.mockImplementation(() => user);
    const result = await getCompromisesForTheDate("2022-22-22");
    expect(result).toBe(mockDocuments.documents);
    expect(getLoggedInUser).toHaveBeenCalled();
  });

  it("Should throw error while trying to get compromises without being logged in", async () => {
    getLoggedInUserMock.mockImplementation(() => null);
    await expect(getCompromisesForTheDate("2022-22-22")).rejects.toThrow();
  });
});

jest
  .spyOn(Databases.prototype, "getDocument")
  .mockResolvedValue(mockDocuments.documents[0]);

jest.spyOn(Databases.prototype, "updateDocument").mockImplementation();

jest.spyOn(Databases.prototype, "createDocument").mockImplementation();

const modifiedDocument = {
  ...mockDocuments.documents[0],
  title: "Modified document",
};

describe("upsertCompromise", () => {
  it("Should update compromise if it exists", async () => {
    getLoggedInUserMock.mockImplementation(() => user);
    await upsertCompromise(modifiedDocument);
    expect(Databases.prototype.getDocument).toHaveBeenCalled();
    expect(Databases.prototype.updateDocument).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      modifiedDocument.id,
      expect.objectContaining({ id: "1", title: "Modified document" }),
    );
    expect(Databases.prototype.createDocument).not.toHaveBeenCalled();
  });

  it("Should not update compromise if the specified user is not the logged in user", async () => {
    getLoggedInUserMock.mockImplementation(() => ({ $id: "another-user-id" }));
    await expect(upsertCompromise(modifiedDocument)).rejects.toThrow(
      /another user/,
    );
  });

  it("Should create the compromise if it does not exists", async () => {
    getLoggedInUserMock.mockImplementation(() => user);

    jest.spyOn(Databases.prototype, "getDocument").mockImplementation(() => {
      throw new AppwriteException("", 404);
    });
    await upsertCompromise(modifiedDocument);
    expect(Databases.prototype.getDocument).toHaveBeenCalled();
    expect(Databases.prototype.updateDocument).not.toHaveBeenCalled();
    expect(Databases.prototype.createDocument).toHaveBeenCalled();
  });
});

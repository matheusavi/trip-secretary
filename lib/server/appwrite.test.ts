import { Databases } from "node-appwrite";
import { getCompromisesForTheDate } from "./appwrite";
import { getLoggedInUser } from "./serverOnlyAppwriteActions";

const mockDocuments = {
  documents: [
    {
      $id: "1",
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

jest
  .spyOn(Databases.prototype, "listDocuments")
  .mockResolvedValue(mockDocuments);

jest.mock("@/lib/server/serverOnlyAppwriteActions", () => ({
  getLoggedInUser: jest
    .fn()
    .mockResolvedValueOnce({ $id: "my-id" })
    .mockResolvedValueOnce(null),
}));

describe("getCompromisesForTheDate", () => {
  it("Should retrive compromises when passing a date", async () => {
    const result = await getCompromisesForTheDate("2022-22-22");
    expect(result).toBe(mockDocuments.documents);
    expect(getLoggedInUser).toHaveBeenCalled();
  });

  it("Should throw error while trying to get compromises without being logged in", async () => {
    await expect(getCompromisesForTheDate("2022-22-22")).rejects.toThrow();
  });
});

import { Databases } from "node-appwrite";
import { getCompromisesForTheDate } from "./appwrite";

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

jest.mock("@/lib/server/serverOnlyAppwriteActions", () => ({
  getLoggedInUser: jest.fn().mockResolvedValue({ $id: "my-id" }),
}));

jest
  .spyOn(Databases.prototype, "listDocuments")
  .mockResolvedValue(mockDocuments);

describe("getCompromisesForTheDate", () => {
  it("Should retrive compromises when passing a date", async () => {
    const result = await getCompromisesForTheDate("2022-22-22");
    expect(result).toBe(mockDocuments.documents);
  });
});

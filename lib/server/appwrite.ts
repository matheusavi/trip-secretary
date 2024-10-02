"use server";
import { Client, Databases, Query, AppwriteException } from "node-appwrite";
import { cookies } from "next/headers";
import {
  createSessionClient,
  getLoggedInUser,
} from "./serverOnlyAppwriteActions";

export async function getCompromisesForTheDate(date: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const databases = new Databases(client);

  const user = await getLoggedInUser();

  let result = await databases.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE,
    process.env.NEXT_APPWRITE_COMPROMISES,
    [Query.equal("date", [date]), Query.equal("user", user!.$id)],
  );

  return result.documents;
}

export async function upsertCompromise(obj: any) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const databases = new Databases(client);
  const user = await getLoggedInUser();

  obj.user = user!.$id;
  try {
    const result = await databases.getDocument(
      process.env.NEXT_APPWRITE_DATABASE,
      process.env.NEXT_APPWRITE_COMPROMISES,
      obj.id,
    );

    if (result.user != user!.$id)
      throw new Error("User trying to edit a register for another user");

    await databases.updateDocument(
      process.env.NEXT_APPWRITE_DATABASE,
      process.env.NEXT_APPWRITE_COMPROMISES,
      obj.id,
      obj,
    );
  } catch (ex) {
    if (ex instanceof AppwriteException && ex.code == 404)
      await databases.createDocument(
        process.env.NEXT_APPWRITE_DATABASE,
        process.env.NEXT_APPWRITE_COMPROMISES,
        obj.id,
        obj,
      );
    else throw ex;
  }
}

export async function deleteCompromise(id: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const databases = new Databases(client);
  const user = await getLoggedInUser();

  const result = await databases.getDocument(
    process.env.NEXT_APPWRITE_DATABASE,
    process.env.NEXT_APPWRITE_COMPROMISES,
    id,
  );

  if (result.user != user!.$id)
    throw new Error("User trying to edit a register for another user");

  await databases.deleteDocument(
    process.env.NEXT_APPWRITE_DATABASE,
    process.env.NEXT_APPWRITE_COMPROMISES,
    id,
  );
}

export async function logOutUser() {
  try {
    const { account } = await createSessionClient();

    cookies().delete("my-custom-session");
    await account.deleteSession("current");
  } catch (ex) {
    console.error(ex);
    throw new Error("It was not possible to log out");
  }
}

export async function getLoggedUserData() {
  const user = await getLoggedInUser();
  if (!user) return null;

  return {
    name: user.name,
  };
}

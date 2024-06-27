"use server";
import "server-only";
import {
  Client,
  Account,
  Databases,
  Query,
  AppwriteException,
} from "node-appwrite";
import { cookies } from "next/headers";
import { Compromise } from "@/app/components/compromise/compromise";

export async function createSessionClient() {
  const client = new Client();

  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const session = cookies().get("my-custom-session");

  if (!session || !session.value) throw new Error("No session");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
    .setKey(process.env.NEXT_APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function getCompromisesForTheDate(date: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const databases = new Databases(client);

  let result = await databases.listDocuments(
    process.env.NEXT_APPWRITE_DATABASE,
    process.env.NEXT_APPWRITE_COMPROMISES,
    [Query.equal("date", [date])],
  );

  return result.documents;
}

export async function upsertCompromise(obj: any) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const databases = new Databases(client);
  console.log(obj);
  try {
    await databases.getDocument(
      process.env.NEXT_APPWRITE_DATABASE,
      process.env.NEXT_APPWRITE_COMPROMISES,
      obj.id,
    );

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
    else console.error(ex);
  }
}

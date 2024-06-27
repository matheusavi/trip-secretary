"use server";
import "server-only";
import { Client, Account } from "node-appwrite";
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
  const initialCompromise = new Compromise();

  initialCompromise.id = "test";
  initialCompromise.index = 2;
  initialCompromise.plan = "My plan";
  initialCompromise.costs = 20;
  initialCompromise.resolved = false;
  initialCompromise.size = 2;
  initialCompromise.date = date;
  if (initialCompromise.toPlainObject !== undefined)
    return [initialCompromise?.toPlainObject()];

  return [];
}

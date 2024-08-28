"use client";

import { getLoggedInUser } from "@/lib/server/appwrite";
import ServerCompromiseStorage from "./serverCompromiseStorage";
import CompromiseIndexedDb from "./compromiseIndexedDb";

export async function getCompromiseDb(): Promise<ICompromiseStorage> {
  const user = await getLoggedInUser();

  return user ? new ServerCompromiseStorage() : new CompromiseIndexedDb();
}

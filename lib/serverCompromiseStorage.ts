"use client";

import {
  getCompromisesForTheDate,
  upsertCompromise,
  deleteCompromise,
} from "@/lib/server/appwrite";

export default class ServerCompromiseStorage implements ICompromiseStorage {
  getCompromisesForTheDate(date: string): Promise<any> {
    return getCompromisesForTheDate(date);
  }
  upsertCompromise(obj: any): Promise<void> {
    return upsertCompromise(obj);
  }

  deleteCompromise(id: string): Promise<void> {
    return deleteCompromise(id);
  }
}

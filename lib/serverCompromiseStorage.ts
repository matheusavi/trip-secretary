import {
  getCompromisesForTheDate,
  upsertCompromise,
} from "@/lib/server/appwrite";

export default class ServerCompromiseStorage implements ICompromiseStorage {
  getCompromisesForTheDate(date: string): Promise<any> {
    return getCompromisesForTheDate(date);
  }
  upsertCompromise(obj: any): Promise<void> {
    return upsertCompromise(obj);
  }
}

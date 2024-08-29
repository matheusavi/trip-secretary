import ServerCompromiseStorage from "./serverCompromiseStorage";
import CompromiseIndexedDb from "./compromiseIndexedDb";

class CompromiseDbFactory {
  private static serverCompromiseStorage: ICompromiseStorage | null = null;
  private static compromiseIndexedDb: ICompromiseStorage | null = null;

  public static getCompromiseDb(userIsLoggedIn: boolean): ICompromiseStorage {
    if (userIsLoggedIn) {
      if (!this.serverCompromiseStorage) {
        this.serverCompromiseStorage = new ServerCompromiseStorage();
      }
      return this.serverCompromiseStorage;
    } else {
      if (!this.compromiseIndexedDb) {
        this.compromiseIndexedDb = new CompromiseIndexedDb();
      }
      return this.compromiseIndexedDb;
    }
  }
}

export { CompromiseDbFactory };

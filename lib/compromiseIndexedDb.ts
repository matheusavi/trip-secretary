"use client";

export default class CompromiseIndexedDb implements ICompromiseStorage {
  storedDb: IDBDatabase | undefined = undefined;

  getDatabaseInstance(): Promise<IDBDatabase> {
    if (this.storedDb !== undefined) return Promise.resolve(this.storedDb);

    const request = indexedDB.open("tripsecretary");

    request.onupgradeneeded = function () {
      const localDb = request.result;
      const store = localDb.createObjectStore("compromise", { keyPath: "id" });
      store.createIndex("by_date", "date");
    };

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        this.storedDb = request.result;
        resolve(request.result);
      };

      request.onerror = (e) => {
        console.error("Failed to start the indexed db");
        reject(e);
      };
    });
  }

  async getCompromisesForTheDate(date: string): Promise<any> {
    const db = await this.getDatabaseInstance();
    const tx = db.transaction("compromise", "readonly");
    const store = tx.objectStore("compromise");

    const index = store.index("by_date");
    const getRequest = index.getAll(date);

    return new Promise((resolve) => {
      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };
    });
  }

  async upsertCompromise(obj: any): Promise<void> {
    const db = await this.getDatabaseInstance();

    const tx = db.transaction("compromise", "readwrite");
    const store = tx.objectStore("compromise");

    store.put(obj);

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        resolve();
      };
    });
  }

  async deleteCompromise(id: string): Promise<void> {
    const db = await this.getDatabaseInstance();

    const tx = db.transaction("compromise", "readwrite");
    const store = tx.objectStore("compromise");

    store.delete(id);

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        resolve();
      };
    });
  }
}

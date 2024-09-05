interface ICompromiseStorage {
  getCompromisesForTheDate(date: string): Promise<any>;
  upsertCompromise(obj: any): Promise<void>;
  deleteCompromise(id: string): Promise<void>;
}

export enum ElementType {
  Data,
  Resizer,
}

export class Compromise {
  id!: string;
  index: number = 0;
  plan: string = "";
  costs: number = 0;
  resolved: boolean = false;
  size: number = 0;
  date: string = "";

  static fromPlainObject(obj: any): Compromise {
    const instance = new Compromise();
    instance.id = obj.id;
    instance.index = obj.index;
    instance.plan = obj.plan;
    instance.costs = obj.costs;
    instance.resolved = obj.resolved;
    instance.size = obj.size;
    instance.date = obj.date;
    return instance;
  }

  toPlainObject(): Record<string, any> {
    const plainObject: Record<string, any> = {};
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        plainObject[key] = (this as any)[key];
      }
    }
    return plainObject;
  }
}

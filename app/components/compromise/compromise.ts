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

  toPlainObject?() {
    return {
      id: this.id,
      index: this.index,
      plan: this.plan,
      costs: this.costs,
      resolved: this.resolved,
      size: this.size,
      date: this.date,
    };
  }
}

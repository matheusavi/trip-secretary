export enum ElementType {
  Data,
  Resizer,
}

export class Compromise {
  id: number = 0;
  index: number = 0;
  plan: string = "";
  costs: number = 0;
  resolved: boolean = false;
  size: number = 0;
}

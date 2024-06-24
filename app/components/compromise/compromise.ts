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
}

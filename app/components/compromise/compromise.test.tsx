import {
  Compromise,
  ElementType,
} from "@/app/components/compromise/compromise";

describe("ElementType Enum", () => {
  it("should have Data and Resizer values", () => {
    expect(ElementType.Data).toBe(0);
    expect(ElementType.Resizer).toBe(1);
  });
});

describe("Compromise Class", () => {
  it("should create an instance with default values", () => {
    const compromise = new Compromise();
    expect(compromise.id).toBeUndefined();
    expect(compromise.index).toBe(0);
    expect(compromise.plan).toBe("");
    expect(compromise.costs).toBe(0);
    expect(compromise.resolved).toBe(false);
    expect(compromise.size).toBe(0);
    expect(compromise.date).toBe("");
  });

  it("should create an instance from a plain object", () => {
    const obj = {
      id: "1",
      index: 1,
      plan: "Test Plan",
      costs: 100,
      resolved: true,
      size: 50,
      date: "2023-10-01",
    };
    const compromise = Compromise.fromPlainObject(obj);
    expect(compromise.id).toBe("1");
    expect(compromise.index).toBe(1);
    expect(compromise.plan).toBe("Test Plan");
    expect(compromise.costs).toBe(100);
    expect(compromise.resolved).toBe(true);
    expect(compromise.size).toBe(50);
    expect(compromise.date).toBe("2023-10-01");
  });
});

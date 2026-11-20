import { categories, menu } from "@/data/menu";

describe("menu data", () => {
  it("has unique ids and valid categories", () => {
    const ids = menu.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    const cats = new Set(categories.map((c) => c.id));
    expect(menu.every((m) => cats.has(m.category))).toBe(true);
  });

  it("gives every item either a price or options, never both", () => {
    for (const m of menu) {
      expect(Boolean(m.price !== undefined) !== Boolean(m.options)).toBe(true);
    }
  });

  it("keeps the new categories filled", () => {
    const count = (id: string) => menu.filter((m) => m.category === id).length;
    expect(count("fuertes")).toBe(5);
    expect(count("desayunos")).toBe(4);
    expect(count("kids")).toBe(3);
    expect(menu).toHaveLength(58);
  });

  it("lists the corn quesadilla fillings as single-choice options", () => {
    const q = menu.find((m) => m.id === "quesadilla-maiz");
    expect(q?.options?.map((o) => o.label)).toEqual([
      "Naturales",
      "Pollo",
      "Pierna",
      "Picadillo",
      "Asada",
      "Chorizo",
      "Camarón",
    ]);
    expect(q?.options?.every((o) => o.price === 85)).toBe(true);
    expect(q?.note).toBeUndefined();
  });
});

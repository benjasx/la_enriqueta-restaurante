import { cartMessage } from "@/cart/cartMessage";
import { cartReducer, initialCart, type CartAction } from "@/cart/cartReducer";

const build = (actions: CartAction[]) =>
  actions.reduce(cartReducer, initialCart);

describe("cartMessage", () => {
  it("lists lines with variant, unit, subtotal, total and note", () => {
    const s = build([
      {
        type: "add",
        line: { itemId: "torta-ahogada", optionLabel: "Pollo" },
      },
      {
        type: "add",
        line: {
          itemId: "licores-whisky",
          optionLabel: "Black Label",
          size: "botella",
        },
      },
      { type: "setNote", note: "  sin cebolla " },
    ]);
    expect(cartMessage(s)).toBe(
      [
        "¡Hola La Enriqueta! Quiero hacer este pedido:",
        "- 1 × Torta Ahogada Estilo Tuxpan – Pollo (1 pieza) – $80 MXN",
        "- 1 × Whisky – Black Label – Botella – $2,499 MXN",
        "",
        "Total: $2,579 MXN",
        "Nota: sin cebolla",
      ].join("\n"),
    );
  });

  it("omits variant, unit and note when absent", () => {
    const s = build([
      { type: "add", line: { itemId: "pollo-la-enriqueta" } },
      { type: "add", line: { itemId: "pollo-la-enriqueta" } },
    ]);
    expect(cartMessage(s)).toBe(
      [
        "¡Hola La Enriqueta! Quiero hacer este pedido:",
        "- 2 × Pollo a La Enriqueta – $320 MXN",
        "",
        "Total: $320 MXN",
      ].join("\n"),
    );
  });

  it("appends the customer block for delivery with a normalized location", () => {
    const s = build([
      { type: "add", line: { itemId: "pollo-la-enriqueta" } },
      {
        type: "setCustomer",
        customer: {
          name: " Ana Pérez ",
          phone: "(311) 123-4567",
          address: "Calle Brasil 120",
          mapsLink: "21.5041, -104.8945",
        },
      },
    ]);
    expect(cartMessage(s).split("\n\n").pop()).toBe(
      [
        "Cliente: Ana Pérez",
        "Teléfono: 311 123 4567",
        "Entrega: A domicilio",
        "Domicilio: Calle Brasil 120",
        "Ubicación: https://www.google.com/maps?q=21.5041,-104.8945",
      ].join("\n"),
    );
  });

  it("omits address and location when picking up or when the link is invalid", () => {
    const pickup = build([
      { type: "add", line: { itemId: "pollo-la-enriqueta" } },
      {
        type: "setCustomer",
        customer: {
          name: "Ana Pérez",
          phone: "3111234567",
          mode: "recoger",
          address: "Calle Brasil 120",
          mapsLink: "21.5, -104.8",
        },
      },
    ]);
    const text = cartMessage(pickup);
    expect(text).toContain("Entrega: Recoger en el local");
    expect(text).not.toContain("Domicilio:");
    expect(text).not.toContain("Ubicación:");

    const bad = build([
      { type: "add", line: { itemId: "pollo-la-enriqueta" } },
      {
        type: "setCustomer",
        customer: { name: "Ana Pérez", phone: "3111234567", mapsLink: "hola" },
      },
    ]);
    expect(cartMessage(bad)).not.toContain("Ubicación:");
  });
});

import {
  cartCount,
  cartReducer,
  cartTotal,
  hasAlcohol,
  defaultCustomer,
  initialCart,
  MAX_NOTE,
  MAX_QTY,
  resolveLine,
  type CartAction,
  type CartState,
} from "@/cart/cartReducer";

const run = (actions: CartAction[], from: CartState = initialCart) =>
  actions.reduce(cartReducer, from);

const pozole: CartAction = {
  type: "add",
  line: { itemId: "pozole", optionLabel: "Mediano" },
};
const blackCopeo: CartAction = {
  type: "add",
  line: { itemId: "licores-whisky", optionLabel: "Black Label", size: "copeo" },
};
const blackBotella: CartAction = {
  type: "add",
  line: {
    itemId: "licores-whisky",
    optionLabel: "Black Label",
    size: "botella",
  },
};

describe("cartReducer", () => {
  it("merges the same line and sums qty", () => {
    const s = run([pozole, pozole]);
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0].qty).toBe(2);
    expect(cartTotal(s.lines)).toBe(260);
  });

  it("keeps copeo and botella as distinct lines", () => {
    const s = run([blackCopeo, blackBotella]);
    expect(s.lines).toHaveLength(2);
    expect(cartTotal(s.lines)).toBe(170 + 2499);
  });

  it("caps qty at the maximum", () => {
    const s = run(Array.from({ length: MAX_QTY + 5 }, () => pozole));
    expect(s.lines[0].qty).toBe(MAX_QTY);
    const key = s.lines[0].key;
    expect(run([{ type: "setQty", key, qty: 99 }], s).lines[0].qty).toBe(
      MAX_QTY,
    );
  });

  it("removes the line when qty drops to 0", () => {
    const s = run([pozole]);
    const key = s.lines[0].key;
    expect(run([{ type: "setQty", key, qty: 0 }], s).lines).toHaveLength(0);
    expect(run([{ type: "remove", key }], s).lines).toHaveLength(0);
  });

  it("truncates the note and clear resets everything", () => {
    const s = run([pozole, { type: "setNote", note: "x".repeat(400) }]);
    expect(s.note).toHaveLength(MAX_NOTE);
    expect(run([{ type: "clear" }], s)).toEqual(initialCart);
  });

  it("counts pieces and detects alcohol", () => {
    expect(hasAlcohol(run([pozole]).lines)).toBe(false);
    const s = run([pozole, pozole, blackCopeo]);
    expect(cartCount(s.lines)).toBe(3);
    expect(hasAlcohol(s.lines)).toBe(true);
  });
});

describe("customer", () => {
  it("merges partial updates and truncates long values", () => {
    const s = run([
      { type: "setCustomer", customer: { name: "Ana Pérez", phone: "311" } },
      { type: "setCustomer", customer: { address: "x".repeat(500) } },
    ]);
    expect(s.customer.name).toBe("Ana Pérez");
    expect(s.customer.phone).toBe("311");
    expect(s.customer.address).toHaveLength(200);
    expect(s.customer.mode).toBe("domicilio");
  });

  it("starts with the default customer and survives clear", () => {
    expect(initialCart.customer).toEqual(defaultCustomer);
    const s = run([
      pozole,
      { type: "setCustomer", customer: { name: "Ana Pérez", mode: "recoger" } },
      { type: "clear" },
    ]);
    expect(s.lines).toHaveLength(0);
    expect(s.customer.name).toBe("Ana Pérez");
    expect(s.customer.mode).toBe("recoger");
  });
});

describe("resolveLine", () => {
  it("accepts house brands only as copeo", () => {
    const base = { itemId: "licores-whisky", optionLabel: "Whisky de la casa" };
    expect(resolveLine({ ...base, size: "copeo" })?.unitPrice).toBe(70);
    expect(resolveLine({ ...base, size: "botella" })).toBeUndefined();
  });

  it("accepts wines (no bottle price) without size", () => {
    const line = {
      itemId: "vinos-tintos",
      optionLabel: "Copa de vino de la casa",
    };
    expect(resolveLine(line)?.unitPrice).toBe(80);
    expect(resolveLine({ ...line, size: "copeo" })).toBeUndefined();
  });

  it("rejects unknown items, options and sizes", () => {
    expect(resolveLine({ itemId: "nope" })).toBeUndefined();
    expect(
      resolveLine({ itemId: "pozole", optionLabel: "Gigante" }),
    ).toBeUndefined();
    expect(
      resolveLine({ itemId: "pozole", optionLabel: "Mediano", size: "copeo" }),
    ).toBeUndefined();
  });
});

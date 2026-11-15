import { menu, type MenuItem, type PriceOption } from "@/data/menu";

export type Size = "copeo" | "botella";

export type CartLine = {
  key: string;
  itemId: string;
  optionLabel?: string;
  size?: Size;
  qty: number;
};

export type DeliveryMode = "domicilio" | "recoger";

export type Customer = {
  name: string;
  phone: string;
  mode: DeliveryMode;
  address: string;
  mapsLink: string;
};

export type CartState = {
  lines: CartLine[];
  note: string;
  customer: Customer;
  lastAdded?: { seq: number; key: string };
};

export type CartAction =
  | { type: "add"; line: Omit<CartLine, "key" | "qty"> }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "setNote"; note: string }
  | { type: "setCustomer"; customer: Partial<Customer> }
  | { type: "clear" };

export const MAX_QTY = 20;
export const MAX_NOTE = 300;

export const customerLimits = {
  name: 80,
  phone: 20,
  address: 200,
  mapsLink: 300,
} as const;

export const defaultCustomer: Customer = {
  name: "",
  phone: "",
  mode: "domicilio",
  address: "",
  mapsLink: "",
};

export const initialCart: CartState = {
  lines: [],
  note: "",
  customer: defaultCustomer,
};

export const lineKey = (l: Pick<CartLine, "itemId" | "optionLabel" | "size">) =>
  `${l.itemId}|${l.optionLabel ?? ""}|${l.size ?? ""}`;

export type ResolvedLine = {
  item: MenuItem;
  option?: PriceOption;
  unitPrice: number;
};

// Resuelve una línea contra el menú vigente; undefined si ya no es válida.
export const resolveLine = (
  l: Pick<CartLine, "itemId" | "optionLabel" | "size">,
): ResolvedLine | undefined => {
  const item = menu.find((m) => m.id === l.itemId);
  if (!item) return undefined;
  if (!item.options) {
    if (l.optionLabel !== undefined || l.size !== undefined) return undefined;
    return item.price === undefined
      ? undefined
      : { item, unitPrice: item.price };
  }
  const option = item.options.find((o) => o.label === l.optionLabel);
  if (!option) return undefined;
  // Solo los productos con alguna botella (licores) llevan tamaño.
  if (!item.options.some((o) => o.bottlePrice !== undefined)) {
    return l.size === undefined
      ? { item, option, unitPrice: option.price }
      : undefined;
  }
  if (l.size === "botella") {
    return option.bottlePrice === undefined
      ? undefined
      : { item, option, unitPrice: option.bottlePrice };
  }
  return l.size === "copeo"
    ? { item, option, unitPrice: option.price }
    : undefined;
};

export const lineUnitPrice = (l: CartLine) => resolveLine(l)?.unitPrice ?? 0;

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + lineUnitPrice(l) * l.qty, 0);

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.qty, 0);

export const hasAlcohol = (lines: CartLine[]) =>
  lines.some((l) => {
    const cat = resolveLine(l)?.item.category;
    return cat === "cocteleria" || cat === "licores";
  });

export const cartReducer = (
  state: CartState,
  action: CartAction,
): CartState => {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.line);
      const lastAdded = { seq: (state.lastAdded?.seq ?? 0) + 1, key };
      const found = state.lines.find((l) => l.key === key);
      if (!found) {
        return {
          ...state,
          lines: [...state.lines, { ...action.line, key, qty: 1 }],
          lastAdded,
        };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.key === key ? { ...l, qty: Math.min(l.qty + 1, MAX_QTY) } : l,
        ),
        lastAdded,
      };
    }
    case "setQty": {
      if (action.qty <= 0) {
        return {
          ...state,
          lines: state.lines.filter((l) => l.key !== action.key),
        };
      }
      const qty = Math.min(Math.floor(action.qty), MAX_QTY);
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.key === action.key ? { ...l, qty } : l,
        ),
      };
    }
    case "remove":
      return {
        ...state,
        lines: state.lines.filter((l) => l.key !== action.key),
      };
    case "setNote":
      return { ...state, note: action.note.slice(0, MAX_NOTE) };
    case "setCustomer": {
      const c = { ...state.customer, ...action.customer };
      return {
        ...state,
        customer: {
          name: c.name.slice(0, customerLimits.name),
          phone: c.phone.slice(0, customerLimits.phone),
          mode: c.mode === "recoger" ? "recoger" : "domicilio",
          address: c.address.slice(0, customerLimits.address),
          mapsLink: c.mapsLink.slice(0, customerLimits.mapsLink),
        },
      };
    }
    case "clear":
      return { ...initialCart, customer: state.customer };
  }
};

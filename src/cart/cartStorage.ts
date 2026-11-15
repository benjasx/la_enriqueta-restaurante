import {
  customerLimits,
  defaultCustomer,
  initialCart,
  lineKey,
  MAX_NOTE,
  MAX_QTY,
  resolveLine,
  type CartLine,
  type CartState,
  type Customer,
  type Size,
} from "@/cart/cartReducer";

export const CART_KEY = "enriqueta:cart:v1";
export const CUSTOMER_KEY = "enriqueta:customer:v1";

const parseLine = (raw: unknown): CartLine | undefined => {
  if (typeof raw !== "object" || raw === null) return undefined;
  const r = raw as Record<string, unknown>;
  const { itemId, optionLabel, qty } = r;
  if (typeof itemId !== "string") return undefined;
  if (optionLabel !== undefined && typeof optionLabel !== "string")
    return undefined;
  let size: Size | undefined;
  if (r.size === "copeo" || r.size === "botella") size = r.size;
  else if (r.size !== undefined) return undefined;
  if (typeof qty !== "number" || !Number.isFinite(qty) || qty < 1)
    return undefined;
  const line = { itemId, optionLabel, size };
  if (!resolveLine(line)) return undefined;
  return {
    ...line,
    key: lineKey(line),
    qty: Math.min(Math.floor(qty), MAX_QTY),
  };
};

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : "";

export const loadCustomer = (): Customer => {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return defaultCustomer;
    const d: unknown = JSON.parse(raw);
    if (typeof d !== "object" || d === null) return defaultCustomer;
    const r = d as Record<string, unknown>;
    return {
      name: str(r.name, customerLimits.name),
      phone: str(r.phone, customerLimits.phone),
      mode: r.mode === "recoger" ? "recoger" : "domicilio",
      address: str(r.address, customerLimits.address),
      mapsLink: str(r.mapsLink, customerLimits.mapsLink),
    };
  } catch {
    return defaultCustomer;
  }
};

export const loadCart = (): CartState => {
  const customer = loadCustomer();
  const empty = { ...initialCart, customer };
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return empty;
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return empty;
    const { lines, note } = data as Record<string, unknown>;
    if (!Array.isArray(lines)) return empty;
    const seen = new Set<string>();
    const valid = lines.flatMap((l) => {
      const parsed = parseLine(l);
      if (!parsed || seen.has(parsed.key)) return [];
      seen.add(parsed.key);
      return [parsed];
    });
    return {
      lines: valid,
      note: typeof note === "string" ? note.slice(0, MAX_NOTE) : "",
      customer,
    };
  } catch {
    return empty;
  }
};

export const saveCart = (state: CartState) => {
  try {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({ lines: state.lines, note: state.note }),
    );
  } catch {
    // localStorage no disponible: el carrito sigue en memoria.
  }
  try {
    window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(state.customer));
  } catch {
    // idem para los datos del cliente.
  }
};

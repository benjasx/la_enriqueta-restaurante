import { cartTotal, resolveLine, type CartState } from "@/cart/cartReducer";
import { formatPhone, parseMapsLocation } from "@/cart/customer";
import { money } from "@/data/menu";

const sizeLabel = { copeo: "Copeo", botella: "Botella" } as const;

export const cartMessage = (
  { lines, note, customer }: CartState,
  table: number | null = null,
) => {
  const rows = lines.flatMap((l) => {
    const r = resolveLine(l);
    if (!r) return [];
    const parts = [r.item.name];
    if (r.option) parts.push(r.option.label);
    if (l.size) parts.push(sizeLabel[l.size]);
    const unit = r.item.unit ? ` (${r.item.unit})` : "";
    return [
      `- ${l.qty} × ${parts.join(" – ")}${unit} – ${money(r.unitPrice * l.qty)} MXN`,
    ];
  });
  const out = [
    table !== null
      ? `¡Hola La Enriqueta! Pedido para la MESA ${table}:`
      : "¡Hola La Enriqueta! Quiero hacer este pedido:",
    ...rows,
    "",
    `Total: ${money(cartTotal(lines))} MXN`,
  ];
  const trimmed = note.trim();
  if (trimmed) out.push(`Nota: ${trimmed}`);

  const name = customer.name.trim();
  if (table !== null) {
    if (name) out.push("", `Cliente: ${name}`);
    return out.join("\n");
  }
  const phone = customer.phone.trim();
  if (name || phone) {
    const delivery = customer.mode === "recoger";
    out.push("");
    if (name) out.push(`Cliente: ${name}`);
    if (phone) out.push(`Teléfono: ${formatPhone(phone)}`);
    out.push(`Entrega: ${delivery ? "Recoger en el local" : "A domicilio"}`);
    if (!delivery) {
      const address = customer.address.trim();
      if (address) out.push(`Domicilio: ${address}`);
      const loc = parseMapsLocation(customer.mapsLink);
      if (loc.kind === "ok") out.push(`Ubicación: ${loc.url}`);
    }
  }
  return out.join("\n");
};

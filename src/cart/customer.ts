import type { Customer } from "@/cart/cartReducer";

export type CustomerField = "name" | "phone" | "address" | "mapsLink";

export type CustomerCheck = {
  ok: boolean;
  errors: Partial<Record<CustomerField, string>>;
  missing: string[]; // etiquetas de lo obligatorio que falta o es inválido
  phone: string | null; // 10 dígitos, o null si es inválido
  location: string | null; // enlace normalizado, o null si vacío o inválido
};

export const MIN_ADDRESS = 10;

export const normalizePhone = (raw: string): string | null => {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("52")) digits = digits.slice(2);
  return digits.length === 10 ? digits : null;
};

export const formatPhone = (raw: string) => {
  const d = normalizePhone(raw);
  return d ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : raw.trim();
};

export type MapsLocation =
  { kind: "empty" } | { kind: "ok"; url: string } | { kind: "invalid" };

const COORDS = /^(-?\d{1,3}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)$/;

const isGoogleHost = (host: string, root: string) =>
  host === root || host.endsWith(`.${root}`);

export const mapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;

export const parseMapsLocation = (raw: string): MapsLocation => {
  const text = raw.trim();
  if (!text) return { kind: "empty" };

  const m = COORDS.exec(text);
  if (m) {
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    return Math.abs(lat) <= 90 && Math.abs(lng) <= 180
      ? { kind: "ok", url: `https://www.google.com/maps?q=${m[1]},${m[2]}` }
      : { kind: "invalid" };
  }

  try {
    const u = new URL(text);
    if (u.protocol !== "https:") return { kind: "invalid" };
    const host = u.hostname.toLowerCase();
    const onMapsPath = u.pathname.startsWith("/maps");
    const valid =
      host === "maps.app.goo.gl" ||
      host === "maps.google.com" ||
      (host === "goo.gl" && onMapsPath) ||
      ((isGoogleHost(host, "google.com") ||
        isGoogleHost(host, "google.com.mx")) &&
        onMapsPath);
    return valid ? { kind: "ok", url: u.toString() } : { kind: "invalid" };
  } catch {
    return { kind: "invalid" };
  }
};

export const validateCustomer = (c: Customer): CustomerCheck => {
  const errors: CustomerCheck["errors"] = {};
  const missing: string[] = [];

  if (c.name.trim().split(/\s+/).filter(Boolean).length < 2) {
    errors.name = "Escribe tu nombre completo (nombre y apellido).";
    missing.push("nombre completo");
  }

  const phone = normalizePhone(c.phone);
  if (!phone) {
    errors.phone = "Escribe un teléfono de 10 dígitos.";
    missing.push("teléfono");
  }

  if (c.mode === "domicilio" && c.address.trim().length < MIN_ADDRESS) {
    errors.address = "Escribe calle, número y colonia (mínimo 10 caracteres).";
    missing.push("domicilio");
  }

  let location: string | null = null;
  if (c.mode === "domicilio") {
    const loc = parseMapsLocation(c.mapsLink);
    if (loc.kind === "ok") location = loc.url;
    if (loc.kind === "invalid") {
      errors.mapsLink =
        "No es un enlace de Google Maps ni coordenadas. Pégalo de nuevo o déjalo vacío.";
      missing.push("ubicación válida (o déjala vacía)");
    }
  }

  return { ok: missing.length === 0, errors, missing, phone, location };
};

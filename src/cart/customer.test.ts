import type { Customer } from "@/cart/cartReducer";
import {
  formatPhone,
  mapsUrl,
  normalizePhone,
  parseMapsLocation,
  validateCustomer,
} from "@/cart/customer";

const base: Customer = {
  name: "Ana Pérez",
  phone: "311 123 4567",
  mode: "domicilio",
  address: "Calle Brasil 120, Moctezuma",
  mapsLink: "",
};

describe("validateCustomer", () => {
  it("accepts complete delivery data with no location", () => {
    const r = validateCustomer(base);
    expect(r.ok).toBe(true);
    expect(r.location).toBeNull();
  });

  it("flags every missing required field", () => {
    const r = validateCustomer({
      ...base,
      name: "Ana",
      phone: "123",
      address: "x",
    });
    expect(r.ok).toBe(false);
    expect(r.missing).toEqual(["nombre completo", "teléfono", "domicilio"]);
  });

  it("only requires name and phone when picking up", () => {
    const r = validateCustomer({
      ...base,
      mode: "recoger",
      address: "",
      mapsLink: "texto basura",
    });
    expect(r.ok).toBe(true);
    expect(r.location).toBeNull();
  });

  it("blocks an invalid location but not an empty one", () => {
    expect(validateCustomer({ ...base, mapsLink: "hola" }).ok).toBe(false);
    expect(validateCustomer({ ...base, mapsLink: "  " }).ok).toBe(true);
  });
});

describe("phone", () => {
  it("normalizes separators and the 52 prefix", () => {
    expect(normalizePhone("(311) 123-4567")).toBe("3111234567");
    expect(normalizePhone("+52 311 123 4567")).toBe("3111234567");
    expect(normalizePhone("311 123 456")).toBeNull();
  });

  it("formats as NNN NNN NNNN", () => {
    expect(formatPhone("3111234567")).toBe("311 123 4567");
  });
});

describe("parseMapsLocation", () => {
  it("accepts Google Maps links", () => {
    for (const url of [
      "https://maps.app.goo.gl/AbC123",
      "https://www.google.com/maps/place/Tepic",
      "https://www.google.com.mx/maps?q=21.5,-104.9",
      "https://maps.google.com/?q=21.5,-104.9",
      "https://goo.gl/maps/xyz",
    ]) {
      expect(parseMapsLocation(url).kind).toBe("ok");
    }
  });

  it("rejects other hosts, http and plain text", () => {
    for (const text of [
      "https://evil.example/maps",
      "https://google.com.evil.example/maps",
      "http://www.google.com/maps",
      "https://www.google.com/search?q=maps",
      "mi casa",
    ]) {
      expect(parseMapsLocation(text).kind).toBe("invalid");
    }
  });

  it("normalizes valid coordinates and rejects out-of-range ones", () => {
    expect(parseMapsLocation("21.5041, -104.8945")).toEqual({
      kind: "ok",
      url: "https://www.google.com/maps?q=21.5041,-104.8945",
    });
    expect(parseMapsLocation("91, 10").kind).toBe("invalid");
    expect(parseMapsLocation("10, 181").kind).toBe("invalid");
    expect(parseMapsLocation("").kind).toBe("empty");
  });

  it("builds a link with 6 decimals from geolocation", () => {
    expect(mapsUrl(21.5041, -104.8945)).toBe(
      "https://www.google.com/maps?q=21.504100,-104.894500",
    );
  });
});

describe("validateCustomer in table mode", () => {
  it("requires nothing when a table is active", () => {
    const empty: Customer = { ...base, name: "", phone: "", address: "" };
    const r = validateCustomer(empty, 7);
    expect(r.ok).toBe(true);
    expect(r.missing).toEqual([]);
  });

  it("ignores an invalid stored location in table mode", () => {
    expect(validateCustomer({ ...base, mapsLink: "nope" }, 7).ok).toBe(true);
  });
});

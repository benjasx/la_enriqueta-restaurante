import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { App } from "@/App";
import { CART_KEY, CUSTOMER_KEY } from "@/cart/cartStorage";
import { TABLE_KEY } from "@/table/tableSession";

const visit = (search: string) =>
  window.history.replaceState({}, "", `/${search}`);

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  visit("");
  window.localStorage.setItem(
    CART_KEY,
    JSON.stringify({
      lines: [{ itemId: "pozole", optionLabel: "Mediano", qty: 2 }],
      note: "sin cebolla",
    }),
  );
  window.localStorage.setItem(
    CUSTOMER_KEY,
    JSON.stringify({
      name: "Ana Pérez",
      phone: "311 123 4567",
      mode: "domicilio",
      address: "Calle Brasil 120, Col. Moctezuma",
      mapsLink: "21.5041, -104.8945",
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  visit("");
});

const nav = () => screen.getByRole("navigation", { name: /principal/i });
const openCart = async () => {
  await userEvent.click(
    within(nav()).getByRole("button", { name: /ver pedido/i }),
  );
  return screen.getByRole("dialog", { name: /tu pedido/i });
};

describe("table mode", () => {
  it("activates from ?mesa=7, cleans the URL and shows the chip", () => {
    visit("?mesa=7");
    render(<App />);
    expect(within(nav()).getByText("Mesa 7")).toBeInTheDocument();
    expect(window.location.search).toBe("");
    expect(window.sessionStorage.getItem(TABLE_KEY)).toBe("7");
  });

  it("keeps the table after a reload", () => {
    visit("?mesa=7");
    const first = render(<App />);
    first.unmount();
    render(<App />);
    expect(within(nav()).getByText("Mesa 7")).toBeInTheDocument();
  });

  it("does not keep the table in a new session", () => {
    render(<App />);
    expect(within(nav()).queryByText(/^Mesa \d+$/)).toBeNull();
  });

  it.each(["0", "21", "abc", "3.5", "07", ""])("ignores ?mesa=%s", (value) => {
    visit(`?mesa=${value}`);
    render(<App />);
    expect(within(nav()).queryByText(/^Mesa \d+$/)).toBeNull();
  });

  it("keeps the stored table when the URL has an invalid one", () => {
    window.sessionStorage.setItem(TABLE_KEY, "4");
    visit("?mesa=99");
    render(<App />);
    expect(within(nav()).getByText("Mesa 4")).toBeInTheDocument();
  });

  it("asks only for an optional name and sends the table message", async () => {
    visit("?mesa=7");
    render(<App />);
    const dialog = await openCart();
    expect(dialog).toHaveTextContent("Pedido para la Mesa 7");
    expect(within(dialog).getByLabelText(/nombre \(opcional\)/i)).toHaveValue(
      "Ana Pérez",
    );
    for (const re of [/teléfono/i, /domicilio/i, /ubicación de google/i]) {
      expect(within(dialog).queryByLabelText(re)).toBeNull();
    }
    expect(within(dialog).queryByRole("radiogroup")).toBeNull();

    const send = within(dialog).getByRole("link", {
      name: /enviar pedido por whatsapp/i,
    });
    const href = send.getAttribute("href") ?? "";
    expect(href.startsWith("https://wa.me/523111397571?text=")).toBe(true);
    const text = decodeURIComponent(href.split("?text=")[1]);
    expect(text.startsWith("¡Hola La Enriqueta! Pedido para la MESA 7:")).toBe(
      true,
    );
    expect(text).toContain("Nota: sin cebolla");
    expect(text).toContain("Cliente: Ana Pérez");
    for (const banned of [
      "Teléfono:",
      "Entrega:",
      "Domicilio:",
      "Ubicación:",
    ]) {
      expect(text).not.toContain(banned);
    }
  });

  it("enables sending without any customer data, but not with an empty cart", async () => {
    window.localStorage.removeItem(CUSTOMER_KEY);
    visit("?mesa=2");
    render(<App />);
    const dialog = await openCart();
    expect(
      within(dialog).getByRole("link", { name: /enviar pedido por whatsapp/i }),
    ).toBeInTheDocument();
    await userEvent.click(
      within(dialog).getByRole("button", { name: /vaciar pedido/i }),
    );
    expect(
      within(dialog).getByRole("button", {
        name: /enviar pedido por whatsapp/i,
      }),
    ).toBeDisabled();
  });

  it("leaves table mode, restores the normal form and keeps the lines", async () => {
    visit("?mesa=7");
    render(<App />);
    const dialog = await openCart();
    await userEvent.click(
      within(dialog).getByRole("button", { name: /salir del modo mesa/i }),
    );
    expect(window.sessionStorage.getItem(TABLE_KEY)).toBeNull();
    expect(within(nav()).queryByText("Mesa 7")).toBeNull();
    expect(within(dialog).getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(dialog).toHaveTextContent("Pozole");
    const href =
      within(dialog)
        .getByRole("link", { name: /enviar pedido por whatsapp/i })
        .getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("Quiero hacer este pedido:");
  });

  it("works with sessionStorage blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
    ) {
      if (key === TABLE_KEY) throw new Error("blocked");
    });
    visit("?mesa=5");
    render(<App />);
    expect(within(nav()).getByText("Mesa 5")).toBeInTheDocument();
  });
});

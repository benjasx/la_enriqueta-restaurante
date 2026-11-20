import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";
import { cartMessage } from "@/cart/cartMessage";
import { CART_KEY, CUSTOMER_KEY, loadCart } from "@/cart/cartStorage";
import { menu } from "@/data/menu";
import { whatsappUrl } from "@/data/site";

beforeEach(() => window.localStorage.clear());

const customer = {
  name: "Ana Pérez López",
  phone: "311 123 4567",
  mode: "domicilio",
  address: "Calle Brasil 120, Col. Moctezuma",
  mapsLink: "",
};

const seedCustomer = (extra: Record<string, string> = {}) =>
  window.localStorage.setItem(
    CUSTOMER_KEY,
    JSON.stringify({ ...customer, ...extra }),
  );

const seed = () =>
  window.localStorage.setItem(
    CART_KEY,
    JSON.stringify({
      lines: [
        { itemId: "pozole", optionLabel: "Mediano", qty: 2 },
        {
          itemId: "licores-whisky",
          optionLabel: "Black Label",
          size: "botella",
          qty: 1,
        },
      ],
      note: "",
    }),
  );

describe("Cart UI", () => {
  it("shows the nav cart button empty, with no WhatsApp order buttons", async () => {
    const user = userEvent.setup();
    render(<App />);
    const nav = screen.getByRole("navigation", { name: /principal/i });
    const cart = within(nav).getByRole("button", {
      name: /ver pedido: vacío/i,
    });
    expect(screen.getAllByRole("button", { name: /ver pedido/i })).toHaveLength(
      1,
    );
    expect(screen.queryByText(/pedir por whatsapp/i)).toBeNull();
    expect(screen.queryByText(/contactar por whatsapp/i)).toBeNull();
    expect(screen.getByText(/escribir por whatsapp/i)).toBeInTheDocument();
    await user.click(cart);
    expect(screen.getByRole("dialog")).toHaveTextContent(/está vacío/i);
  });

  it("opens the panel, edits quantities and closes with Escape", async () => {
    seed();
    const user = userEvent.setup();
    render(<App />);
    const open = screen.getByRole("button", { name: /ver pedido/i });
    expect(open).toHaveAccessibleName(/3 piezas, \$2,759/);
    await user.click(open);

    const dialog = screen.getByRole("dialog", { name: /tu pedido/i });
    expect(dialog).toHaveTextContent("$2,759");

    await user.click(
      screen.getByRole("button", { name: /agregar uno de pozole mediano/i }),
    );
    expect(dialog).toHaveTextContent("$2,889");

    await user.click(screen.getAllByRole("button", { name: /^quitar$/i })[0]);
    expect(dialog).not.toHaveTextContent("Pozole");
    expect(dialog).toHaveTextContent("$2,499");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("button", { name: /ver pedido/i })).toHaveFocus();
  });

  it("shows the empty state when the last line is removed", async () => {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        lines: [{ itemId: "pozole", optionLabel: "Mediano", qty: 1 }],
        note: "",
      }),
    );
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    await user.click(
      screen.getByRole("button", { name: /quitar uno de pozole/i }),
    );
    expect(screen.getByRole("dialog")).toHaveTextContent(/está vacío/i);
  });

  it("sends one WhatsApp message with lines, total and note", async () => {
    seed();
    seedCustomer({ mapsLink: "21.5041, -104.8945" });
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    await user.type(screen.getByLabelText(/nota del pedido/i), "sin cebolla");

    const send = screen.getByRole("link", { name: /enviar pedido/i });
    const href = send.getAttribute("href") ?? "";
    expect(href.startsWith("https://wa.me/523115130988?text=")).toBe(true);
    const text = decodeURIComponent(href.split("?text=")[1]);
    expect(text).toContain("- 2 × Pozole – Mediano – $260 MXN");
    expect(text).toContain("- 1 × Whisky – Black Label – Botella – $2,499 MXN");
    expect(text).toContain("Total: $2,759 MXN");
    expect(text).toContain("Nota: sin cebolla");
    expect(text).toContain("Cliente: Ana Pérez López");
    expect(text).toContain("Teléfono: 311 123 4567");
    expect(text).toContain("Entrega: A domicilio");
    expect(text).toContain("Domicilio: Calle Brasil 120, Col. Moctezuma");
    expect(text).toContain(
      "Ubicación: https://www.google.com/maps?q=21.5041,-104.8945",
    );
  });

  it("shows the +18 notice only with alcohol", async () => {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        lines: [{ itemId: "pozole", optionLabel: "Mediano", qty: 1 }],
        note: "",
      }),
    );
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("clears the cart without sending and disables send when empty", async () => {
    seed();
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    expect(screen.getByRole("note")).toHaveTextContent(/18 años/);
    await user.click(screen.getByRole("button", { name: /vaciar pedido/i }));
    expect(screen.getByRole("dialog")).toHaveTextContent(/está vacío/i);
    expect(
      screen.getByRole("button", { name: /enviar pedido/i }),
    ).toBeDisabled();
    expect(screen.queryByRole("link", { name: /enviar pedido/i })).toBeNull();
  });

  it("keeps a 10-line order within a safe URL length", () => {
    const lines = menu
      .filter((m) => m.price !== undefined)
      .slice(0, 10)
      .map((m) => ({ itemId: m.id, qty: 20 }));
    expect(lines).toHaveLength(10);
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({ lines, note: "x".repeat(300) }),
    );
    window.localStorage.setItem(
      CUSTOMER_KEY,
      JSON.stringify({
        ...customer,
        name: "N ".repeat(40),
        address: "d".repeat(200),
        mapsLink: "https://www.google.com/maps/place/" + "a".repeat(240),
      }),
    );
    render(<App />);
    const href = whatsappUrl(cartMessage(loadCart()));
    expect(href.length).toBeLessThan(4000);
  });

  it("shows a single toast for the latest add and hides it after 2 s", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await user.click(
      screen.getByRole("button", { name: /agregar pollo a la enriqueta/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /agregar el especial la enriqueta/i }),
    );
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Agregado: El Especial La Enriqueta");
    expect(status).not.toHaveTextContent("Pollo a La Enriqueta");
    await waitFor(() => expect(status).toBeEmptyDOMElement(), {
      timeout: 4000,
    });
  });

  it("hides the toast while the panel is open", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: /agregar pollo a la enriqueta/i }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Agregado");
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toBeEmptyDOMElement(),
    );
  });

  it("asks for the delivery data and blocks sending until it is valid", async () => {
    seed();
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));

    const send = screen.getByRole("button", { name: /enviar pedido/i });
    expect(send).toBeDisabled();
    expect(
      screen.getByText(/falta: nombre completo, teléfono, domicilio/i),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/nombre completo/i), "Ana");
    await user.type(screen.getByLabelText(/teléfono/i), "311123");
    await user.type(screen.getByLabelText(/^domicilio/i), "Calle 1");
    expect(
      screen.getByRole("button", { name: /enviar pedido/i }),
    ).toBeDisabled();

    await user.type(screen.getByLabelText(/nombre completo/i), " Pérez");
    await user.type(screen.getByLabelText(/teléfono/i), "4567");
    await user.type(screen.getByLabelText(/^domicilio/i), "234 Col. Centro");
    expect(screen.getByRole("link", { name: /enviar pedido/i })).toBeVisible();
  });

  it("blocks sending with an invalid location and shows a valid one", async () => {
    seed();
    seedCustomer();
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));

    const maps = screen.getByLabelText(/ubicación de google maps/i);
    await user.type(maps, "mi casa");
    expect(screen.getByText(/no es un enlace de google maps/i)).toBeVisible();
    expect(
      screen.getByRole("button", { name: /enviar pedido/i }),
    ).toBeDisabled();

    await user.clear(maps);
    await user.type(maps, "https://maps.app.goo.gl/AbC123");
    expect(
      screen.getByRole("link", { name: /ver en google maps/i }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: /enviar pedido/i })).toBeVisible();
  });

  it("fills the location from the browser geolocation", async () => {
    seed();
    seedCustomer();
    const getCurrentPosition = vi.fn((ok: PositionCallback) =>
      ok({
        coords: { latitude: 21.5041, longitude: -104.8945 },
      } as GeolocationPosition),
    );
    vi.stubGlobal("navigator", {
      ...navigator,
      geolocation: { getCurrentPosition },
    });
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    await user.click(
      screen.getByRole("button", { name: /usar mi ubicación/i }),
    );
    expect(screen.getByLabelText(/ubicación de google maps/i)).toHaveValue(
      "https://www.google.com/maps?q=21.504100,-104.894500",
    );
    vi.unstubAllGlobals();
  });

  it("explains a denied geolocation permission", async () => {
    seed();
    seedCustomer();
    const getCurrentPosition = vi.fn(
      (_ok: PositionCallback, fail: PositionErrorCallback) =>
        fail({ code: 1 } as GeolocationPositionError),
    );
    vi.stubGlobal("navigator", {
      ...navigator,
      geolocation: { getCurrentPosition },
    });
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    await user.click(
      screen.getByRole("button", { name: /usar mi ubicación/i }),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/no diste permiso/i);
    vi.unstubAllGlobals();
  });

  it("hides address and location when picking up", async () => {
    seed();
    seedCustomer({ address: "", mode: "recoger" });
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    expect(screen.queryByLabelText(/^domicilio/i)).toBeNull();
    expect(screen.queryByLabelText(/ubicación de google maps/i)).toBeNull();
    const href =
      screen
        .getByRole("link", { name: /enviar pedido/i })
        .getAttribute("href") ?? "";
    const text = decodeURIComponent(href);
    expect(text).toContain("Entrega: Recoger en el local");
    expect(text).not.toContain("Domicilio:");
  });

  it("keeps the customer data after clearing the order", async () => {
    seed();
    seedCustomer();
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /ver pedido/i }));
    expect(screen.getByText(/solo en tu dispositivo/i)).toBeVisible();
    await user.click(screen.getByRole("button", { name: /vaciar pedido/i }));
    expect(loadCart().customer.name).toBe("Ana Pérez López");
    expect(
      JSON.parse(window.localStorage.getItem(CUSTOMER_KEY) ?? "{}").phone,
    ).toBe("311 123 4567");
  });
});

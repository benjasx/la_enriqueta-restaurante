import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";
import { MesaApp } from "@/MesaApp";

const KEY = "abcDEF1234567890_-xyz";
const visit = (search: string) =>
  window.history.replaceState({}, "", `/mesa.html${search}`);
const access = (n: number | string) => visit(`?k=${KEY}&n=${n}`);
const locked = () =>
  screen.getByText(/escanea el código qr de tu mesa para ver el menú/i);

beforeEach(() => {
  window.localStorage.clear();
  vi.stubEnv("VITE_MESA_KEY", KEY);
});

afterEach(() => {
  vi.unstubAllEnvs();
  window.history.replaceState({}, "", "/");
});

describe("MesaApp access", () => {
  it("shows the menu, the karaoke banner and the table with a valid code", () => {
    access(7);
    render(<MesaApp />);
    expect(screen.getByText("Mesa 7")).toBeInTheDocument();
    expect(
      within(
        screen.getByRole("group", { name: /categorías del menú/i }),
      ).getAllByRole("link"),
    ).toHaveLength(11);
    expect(
      screen.getByRole("region", { name: /viernes de karaoke/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^ver pedido:/i }),
    ).toBeInTheDocument();
  });

  it("orders header, hero, menu and karaoke band", () => {
    access(7);
    const { container } = render(<MesaApp />);
    const hero = screen.getByRole("heading", {
      level: 1,
      name: "¿Qué se te antoja hoy?",
    });
    const header = container.querySelector("header")!;
    const menu = container.querySelector("#menu")!;
    const karaoke = container.querySelector("#karaoke")!;
    const before = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(before(header, hero)).toBe(true);
    expect(before(hero, menu)).toBe(true);
    expect(before(menu, karaoke)).toBe(true);
    expect(screen.getByRole("link", { name: "Ver el menú" })).toHaveAttribute(
      "href",
      "#menu",
    );
    expect(
      screen.getByRole("link", { name: "Viernes de karaoke" }),
    ).toHaveAttribute("href", "#karaoke");
    expect(screen.getByRole("link", { name: /ver ofertas/i })).toHaveAttribute(
      "href",
      "#ofertas",
    );
    expect(
      screen.getByRole("img", { name: /micheladas 2x1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /tragos 2x1/i }),
    ).toBeInTheDocument();
    expect(
      within(document.querySelector("section#ofertas")!).getByRole("heading", {
        name: /promociones de tamales/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ver coctelería" }),
    ).toHaveAttribute("href", "#cocteleria");
    expect(
      within(hero.closest("section")!).getByRole("img", { name: "Pozole" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["no parameters", ""],
    ["a wrong code", `?k=otro-codigo-largo-123&n=7`],
    ["no code", `?n=7`],
    ["a code without n", `?k=${KEY}`],
    ["n = 0", `?k=${KEY}&n=0`],
    ["n = 61", `?k=${KEY}&n=61`],
    ["n = 07", `?k=${KEY}&n=07`],
    ["n = abc", `?k=${KEY}&n=abc`],
  ])("shows only the neutral screen with %s", (_name, search) => {
    visit(search);
    render(<MesaApp />);
    expect(locked()).toBeInTheDocument();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByRole("region")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: "¿Qué se te antoja hoy?" }),
    ).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText(/^Mesa \d+$/)).toBeNull();
  });

  it("fails closed when VITE_MESA_KEY is not defined", () => {
    vi.stubEnv("VITE_MESA_KEY", "");
    access(7);
    render(<MesaApp />);
    expect(locked()).toBeInTheDocument();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });

  it.each([1, 7, 20])("renders the same page for table %i", (n) => {
    access(n);
    const { container } = render(<MesaApp />);
    const html = container.innerHTML.replaceAll(`Mesa ${n}`, "Mesa N");
    access(1);
    const base = render(<MesaApp />).container.innerHTML.replaceAll(
      "Mesa 1",
      "Mesa N",
    );
    expect(html).toBe(base);
  });

  it("keeps the menu after a reload (the URL is the source of truth)", () => {
    access(7);
    const first = render(<MesaApp />);
    first.unmount();
    render(<MesaApp />);
    expect(screen.getByText("Mesa 7")).toBeInTheDocument();
  });

  it("has no site sections and no links to the main site", () => {
    access(7);
    const { container } = render(<MesaApp />);
    for (const text of [
      /sazón de tuxpan/i,
      /pásale a ver/i,
      /te esperamos/i,
      /aquí te esperamos/i,
      /^galería$/i,
    ]) {
      expect(screen.queryByText(text)).toBeNull();
    }
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
    // SPEC 08: solo enlaces de ancla internos, ninguno a otras páginas.
    expect(container.querySelector('a:not([href^="#"])')).toBeNull();
    expect(container.querySelector("#inicio")).toBeNull();
  });
});

describe("MesaApp ordering", () => {
  it("adds a product and sends the table order without delivery data or the code", async () => {
    window.localStorage.setItem(
      "enriqueta:customer:v1",
      JSON.stringify({
        name: "Ana Pérez",
        phone: "311 123 4567",
        mode: "domicilio",
        address: "Calle Brasil 120, Col. Moctezuma",
        mapsLink: "21.5041, -104.8945",
      }),
    );
    access(7);
    render(<MesaApp />);
    await userEvent.click(
      screen.getAllByRole("button", { name: /pedir|agregar/i })[0],
    );
    await userEvent.click(
      screen.getByRole("button", { name: /^ver pedido:/i }),
    );

    const dialog = screen.getByRole("dialog", { name: /tu pedido/i });
    expect(dialog).toHaveTextContent("Pedido para la Mesa 7");
    expect(within(dialog).getByLabelText(/nombre \(opcional\)/i)).toHaveValue(
      "Ana Pérez",
    );
    for (const re of [/teléfono/i, /domicilio/i, /ubicación de google/i]) {
      expect(within(dialog).queryByLabelText(re)).toBeNull();
    }
    expect(within(dialog).queryByRole("radiogroup")).toBeNull();
    expect(
      within(dialog).queryByRole("button", { name: /salir del modo mesa/i }),
    ).toBeNull();

    const send = within(dialog).getByRole("link", {
      name: /enviar pedido por whatsapp/i,
    });
    const href = send.getAttribute("href") ?? "";
    expect(href.startsWith("https://wa.me/523115130988?text=")).toBe(true);
    const text = decodeURIComponent(href.split("?text=")[1]);
    expect(text.startsWith("¡Hola La Enriqueta! Pedido para la MESA 7:")).toBe(
      true,
    );
    expect(text).toContain("Cliente: Ana Pérez");
    for (const banned of [
      "Teléfono:",
      "Entrega:",
      "Domicilio:",
      "Ubicación:",
      KEY,
    ]) {
      expect(text).not.toContain(banned);
    }
  });

  it("keeps the send button disabled while the cart is empty", async () => {
    access(2);
    render(<MesaApp />);
    await userEvent.click(
      screen.getByRole("button", { name: /^ver pedido:/i }),
    );
    expect(
      screen.getByRole("button", { name: /enviar pedido por whatsapp/i }),
    ).toBeDisabled();
  });
});

describe("MesaApp cart bar", () => {
  const add = (container: HTMLElement, label: string) =>
    fireEvent.click(
      container.querySelector<HTMLButtonElement>(
        `button[aria-label^="${label}"]`,
      )!,
    );

  it("shows the bar only with items, opens the panel and clears the cart", async () => {
    access(7);
    const { container } = render(<MesaApp />);
    expect(screen.queryByText("Vaciar")).toBeNull();

    add(container, "Agregar Pozole Mediano");
    add(container, "Agregar Pozole Mediano");
    add(container, "Agregar Whisky Black Label Botella");
    expect(screen.getByText("3 productos")).toBeInTheDocument();
    expect(screen.getByText("$2,759 MXN")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver pedido" }));
    const dialog = screen.getByRole("dialog", { name: /tu pedido/i });
    expect(dialog).toHaveTextContent("Pedido para la Mesa 7");
    expect(screen.queryByText("Vaciar")).toBeNull();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByText("Vaciar")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Vaciar"));
    expect(screen.queryByText("Vaciar")).toBeNull();
    add(container, "Agregar Pozole Mediano");
    expect(screen.getByText("1 producto")).toBeInTheDocument();
  });
});

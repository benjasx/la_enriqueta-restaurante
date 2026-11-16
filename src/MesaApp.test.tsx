import { render, screen, within } from "@testing-library/react";
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
    expect(screen.getAllByRole("tab")).toHaveLength(11);
    expect(
      screen.getByRole("region", { name: /viernes de karaoke/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ver pedido/i }),
    ).toBeInTheDocument();
  });

  it.each([
    ["no parameters", ""],
    ["a wrong code", `?k=otro-codigo-largo-123&n=7`],
    ["no code", `?n=7`],
    ["a code without n", `?k=${KEY}`],
    ["n = 0", `?k=${KEY}&n=0`],
    ["n = 21", `?k=${KEY}&n=21`],
    ["n = 07", `?k=${KEY}&n=07`],
    ["n = abc", `?k=${KEY}&n=abc`],
  ])("shows only the neutral screen with %s", (_name, search) => {
    visit(search);
    render(<MesaApp />);
    expect(locked()).toBeInTheDocument();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByRole("region")).toBeNull();
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
    ]) {
      expect(screen.queryByText(text)).toBeNull();
    }
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
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
    await userEvent.click(screen.getByRole("button", { name: /ver pedido/i }));

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
    expect(href.startsWith("https://wa.me/523111397571?text=")).toBe(true);
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
    await userEvent.click(screen.getByRole("button", { name: /ver pedido/i }));
    expect(
      screen.getByRole("button", { name: /enviar pedido por whatsapp/i }),
    ).toBeDisabled();
  });
});

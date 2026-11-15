import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";

describe("App", () => {
  beforeEach(() => window.localStorage.clear());

  it("renders the restaurant name and main sections", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /la enriqueta/i }),
    ).toBeInTheDocument();
    for (const name of [
      "¿Qué se te antoja hoy?",
      "Sazón de Tuxpan, servido en Tepic",
      "Pásale a ver",
      "Te esperamos",
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
  });

  it("filters the menu by category", async () => {
    render(<App />);
    expect(screen.getAllByRole("tab")).toHaveLength(11);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    await userEvent.click(
      screen.getByRole("tab", { name: /antojitos tradicionales/i }),
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
  });

  it("shows all 57 menu items across the tabs", async () => {
    render(<App />);
    let total = 0;
    for (const tab of screen.getAllByRole("tab")) {
      await userEvent.click(tab);
      total += screen.getAllByRole("heading", { level: 3 }).length;
    }
    expect(total).toBe(57);
  });

  it("adds liquor by glass or bottle to the cart with the exact price", async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole("tab", { name: /licores y vinos/i }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /agregar whisky black label copeo/i }),
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: /agregar whisky black label botella/i,
      }),
    );
    expect(
      screen.getByRole("button", { name: /ver pedido/i }),
    ).toHaveAccessibleName(/2 piezas, \$2,669/);
    expect(document.querySelector('#menu a[href^="https://wa.me"]')).toBeNull();
  });

  it("merges repeated adds into one cart line and sends the whole order", async () => {
    window.localStorage.setItem(
      "enriqueta:customer:v1",
      JSON.stringify({
        name: "Ana Pérez",
        phone: "3111234567",
        mode: "recoger",
        address: "",
        mapsLink: "",
      }),
    );
    render(<App />);
    await userEvent.click(
      screen.getByRole("tab", { name: /antojitos tradicionales/i }),
    );
    const add = screen.getByRole("button", { name: /agregar pozole mediano/i });
    await userEvent.click(add);
    await userEvent.click(add);
    await userEvent.click(screen.getByRole("button", { name: /ver pedido/i }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("$260");
    expect(within(dialog).getAllByRole("listitem")).toHaveLength(1);
    const href =
      screen
        .getByRole("link", { name: /enviar pedido/i })
        .getAttribute("href") ?? "";
    expect(decodeURIComponent(href)).toContain("- 2 × Pozole – Mediano");
  });

  it("adds a new combo to the cart with its exact price", async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole("tab", { name: /desayunos y molletes/i }),
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    await userEvent.click(
      screen.getByRole("button", {
        name: /agregar promociones de tamales desayuno para 2/i,
      }),
    );
    expect(
      screen.getByRole("button", { name: /ver pedido/i }),
    ).toHaveAccessibleName(/1 pieza, \$159/);
  });

  it("shows the karaoke banner right after the menu", () => {
    render(<App />);
    const banner = screen.getByRole("region", { name: /viernes de karaoke/i });
    const img = within(banner).getByRole("img", {
      name: /viernes de karaoke/i,
    });
    expect(img).toHaveAttribute("src", "/img/karaoke.webp");
    expect(banner.querySelector("a, button")).toBeNull();

    const menu = document.getElementById("menu") as HTMLElement;
    const after = Node.DOCUMENT_POSITION_FOLLOWING;
    expect(menu.compareDocumentPosition(banner) & after).toBeTruthy();
    expect(banner.previousElementSibling).toBe(menu);
  });
});

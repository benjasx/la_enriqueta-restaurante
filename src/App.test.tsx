import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";

describe("App", () => {
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
    expect(screen.getAllByRole("tab")).toHaveLength(8);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    await userEvent.click(
      screen.getByRole("tab", { name: /antojitos tradicionales/i }),
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  });

  it("shows all 40 menu items across the tabs", async () => {
    render(<App />);
    let total = 0;
    for (const tab of screen.getAllByRole("tab")) {
      await userEvent.click(tab);
      total += screen.getAllByRole("heading", { level: 3 }).length;
    }
    expect(total).toBe(40);
  });

  it("orders liquor by glass or bottle with the exact price", async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole("tab", { name: /licores y vinos/i }),
    );
    const glass = screen.getByRole("link", { name: /copeo\s*\$170/i });
    const bottle = screen.getByRole("link", { name: /botella\s*\$2,499/i });
    expect(decodeURIComponent(glass.getAttribute("href") ?? "")).toContain(
      "Whisky – Black Label (Copeo) – $170 MXN",
    );
    expect(decodeURIComponent(bottle.getAttribute("href") ?? "")).toContain(
      "Whisky – Black Label (Botella) – $2,499 MXN",
    );
  });
});

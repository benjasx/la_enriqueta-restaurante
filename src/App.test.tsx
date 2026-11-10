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
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(9);
    await userEvent.click(
      screen.getByRole("tab", { name: /antojitos tradicionales/i }),
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
  });
});

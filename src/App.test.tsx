import { render, screen } from "@testing-library/react";
import { App } from "@/App";

describe("App", () => {
  it("renders the restaurant name and main sections", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /la enriqueta/i }),
    ).toBeInTheDocument();
    for (const name of [
      "Menú",
      "Galería",
      "Nosotros",
      "Ubicación y contacto",
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
  });
});

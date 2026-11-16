import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach } from "vitest";
import { CartProvider } from "@/cart/CartContext";
import { CART_KEY } from "@/cart/cartStorage";
import { MesaMenu } from "@/components/MesaMenu";
import { categories, menu, menuDisclaimer, menuNotice } from "@/data/menu";

const setup = () => {
  const view = render(
    <CartProvider>
      <MesaMenu />
    </CartProvider>,
  );
  const btn = (label: string) =>
    view.container.querySelector<HTMLButtonElement>(
      `button[aria-label^="${label}"]`,
    );
  return { ...view, btn };
};

beforeEach(() => window.localStorage.clear());

describe("MesaMenu", () => {
  it("lists the 11 categories as anchor tabs with their counts", () => {
    setup();
    const tabs = within(
      screen.getByRole("group", { name: /categorías del menú/i }),
    ).getAllByRole("link");
    expect(tabs.map((a) => a.getAttribute("href"))).toEqual(
      categories.map((c) => `#${c.id}`),
    );
    categories.forEach((c, i) => {
      const n = menu.filter((m) => m.category === c.id).length;
      expect(tabs[i]).toHaveTextContent(`${c.label} ${n}`);
    });
  });

  it("renders every category in a section with its title and count", () => {
    const { container } = setup();
    for (const c of categories) {
      const n = menu.filter((m) => m.category === c.id).length;
      const section = container.querySelector(`section#${c.id}`)!;
      expect(section.querySelector("h2")).toHaveTextContent(c.label);
      expect(section).toHaveTextContent(
        `${n} ${n === 1 ? "platillo" : "platillos"}`,
      );
      expect(section.querySelectorAll("article")).toHaveLength(n);
    }
    expect(container.querySelectorAll("article")).toHaveLength(menu.length);
  });

  it("shows name, note and photo only when they exist", () => {
    const { container } = setup();
    const fuertes = container.querySelector("section#fuertes")!;
    expect(fuertes).toHaveTextContent("Bistec a la Mexicana");
    expect(fuertes).toHaveTextContent(/chilaquiles rojos y frijolitos/i);
    expect(fuertes.querySelector("img")?.getAttribute("src")).toBe(
      "/img/bistec_mex.webp",
    );
    const tasajo = [...fuertes.querySelectorAll("article")].find((a) =>
      a.textContent?.includes("Tasajo de Arrachera"),
    )!;
    expect(tasajo.querySelector("img")).toBeNull();
  });

  it("shows the allergen notice and the price disclaimer", () => {
    setup();
    expect(screen.getByText(menuNotice)).toBeInTheDocument();
    expect(screen.getByText(menuDisclaimer)).toBeInTheDocument();
  });

  it("adds a line per option and counts it on the button", () => {
    const { btn } = setup();
    const b = () => btn("Agregar Pozole Mediano")!;
    expect(b()).toHaveTextContent("Agregar +");
    fireEvent.click(b());
    expect(b()).toHaveTextContent("1 en pedido");
    fireEvent.click(b());
    expect(b()).toHaveTextContent("2 en pedido");
    expect(btn("Agregar Pozole Grande")).toHaveTextContent("Agregar +");
  });

  it("disables a button at 20 units", () => {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        lines: [{ itemId: "pozole", optionLabel: "Mediano", qty: 19 }],
        note: "",
      }),
    );
    const { btn } = setup();
    expect(btn("Agregar Pozole Mediano")).toHaveTextContent("19 en pedido");
    expect(btn("Agregar Pozole Mediano")).toBeEnabled();
    fireEvent.click(btn("Agregar Pozole Mediano")!);
    expect(btn("Agregar Pozole Mediano")).toHaveTextContent("20 en pedido");
    expect(btn("Agregar Pozole Mediano")).toBeDisabled();
  });

  it("offers Copeo and Botella as separate lines for liquors", () => {
    const { btn } = setup();
    expect(btn("Agregar Whisky Black Label Copeo")).toBeInTheDocument();
    expect(btn("Agregar Whisky Black Label Botella")).toBeInTheDocument();
    fireEvent.click(btn("Agregar Whisky Black Label Copeo")!);
    expect(btn("Agregar Whisky Black Label Copeo")).toHaveTextContent(
      "1 en pedido",
    );
    expect(btn("Agregar Whisky Black Label Botella")).toHaveTextContent(
      "Agregar +",
    );
  });

  it.each([
    ["Whisky", "Whisky de la casa"],
    ["Tequila", "Tequila de la Casa"],
    ["Mezcal", "Mezcal de la Casa"],
  ])("only offers Copeo for %s %s", (name, option) => {
    const { btn } = setup();
    expect(btn(`Agregar ${name} ${option} Copeo`)).toBeInTheDocument();
    expect(btn(`Agregar ${name} ${option} Botella`)).toBeNull();
  });

  it("adds single-price products without an option", () => {
    const { btn } = setup();
    fireEvent.click(btn("Agregar Torta de Tinga")!);
    expect(btn("Agregar Torta de Tinga")).toHaveTextContent("1 en pedido");
  });
});

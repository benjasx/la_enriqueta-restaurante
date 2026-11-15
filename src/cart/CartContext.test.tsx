import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartProvider } from "@/cart/CartContext";
import { CART_KEY, CUSTOMER_KEY } from "@/cart/cartStorage";
import { useCart } from "@/cart/useCart";

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

beforeEach(() => window.localStorage.clear());

describe("CartProvider", () => {
  it("persists changes and restores them on mount", () => {
    const first = renderHook(() => useCart(), { wrapper });
    act(() =>
      first.result.current.dispatch({
        type: "add",
        line: { itemId: "pozole", optionLabel: "Mediano" },
      }),
    );
    act(() =>
      first.result.current.dispatch({ type: "setNote", note: "sin cebolla" }),
    );
    first.unmount();

    const second = renderHook(() => useCart(), { wrapper });
    expect(second.result.current.state.lines).toHaveLength(1);
    expect(second.result.current.state.lines[0].qty).toBe(1);
    expect(second.result.current.state.note).toBe("sin cebolla");
  });

  it("drops lines that no longer exist in the menu", () => {
    window.localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        lines: [
          { itemId: "ya-no-existe", qty: 1 },
          { itemId: "pozole", optionLabel: "Grande", qty: 2 },
        ],
        note: "",
      }),
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.state.lines).toHaveLength(1);
    expect(result.current.state.lines[0].optionLabel).toBe("Grande");
  });

  it("starts empty with invalid JSON", () => {
    window.localStorage.setItem(CART_KEY, "{no es json");
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.state.lines).toHaveLength(0);
  });

  it("works when localStorage throws", () => {
    const get = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    const set = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() =>
      result.current.dispatch({
        type: "add",
        line: { itemId: "pollo-la-enriqueta" },
      }),
    );
    expect(result.current.state.lines).toHaveLength(1);
    get.mockRestore();
    set.mockRestore();
  });

  it("persists the customer under its own key and restores it", () => {
    const first = renderHook(() => useCart(), { wrapper });
    act(() =>
      first.result.current.dispatch({
        type: "setCustomer",
        customer: { name: "Ana Pérez", phone: "3111234567", mode: "recoger" },
      }),
    );
    first.unmount();
    expect(
      JSON.parse(window.localStorage.getItem(CUSTOMER_KEY) ?? "{}").name,
    ).toBe("Ana Pérez");
    const second = renderHook(() => useCart(), { wrapper });
    expect(second.result.current.state.customer).toMatchObject({
      name: "Ana Pérez",
      phone: "3111234567",
      mode: "recoger",
    });
  });

  it("ignores a corrupt customer entry", () => {
    window.localStorage.setItem(CUSTOMER_KEY, "{roto");
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.state.customer.name).toBe("");
    expect(result.current.state.customer.mode).toBe("domicilio");
  });
});

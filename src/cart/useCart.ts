import { createContext, useContext, type Dispatch } from "react";
import type { CartAction, CartState } from "@/cart/cartReducer";

export type CartContextValue = {
  state: CartState;
  dispatch: Dispatch<CartAction>;
};

export const CartContext = createContext<CartContextValue | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};

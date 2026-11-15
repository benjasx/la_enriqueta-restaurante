import { useEffect, useReducer, type ReactNode } from "react";
import { cartReducer } from "@/cart/cartReducer";
import { loadCart, saveCart } from "@/cart/cartStorage";
import { CartContext } from "@/cart/useCart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    saveCart(state);
  }, [state]);

  return <CartContext value={{ state, dispatch }}>{children}</CartContext>;
};

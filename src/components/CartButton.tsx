import { motion, useReducedMotion } from "motion/react";
import type { Ref } from "react";
import { cartCount, cartTotal } from "@/cart/cartReducer";
import { useCart } from "@/cart/useCart";
import { money } from "@/data/menu";

export const CartButton = ({
  onOpen,
  ref,
}: {
  onOpen: () => void;
  ref?: Ref<HTMLButtonElement>;
}) => {
  const { state } = useCart();
  const reduced = useReducedMotion();
  const count = cartCount(state.lines);
  const total = money(cartTotal(state.lines));
  const seq = state.lastAdded?.seq ?? 0;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label={
        count === 0
          ? "Ver pedido: vacío"
          : `Ver pedido: ${count} ${count === 1 ? "pieza" : "piezas"}, ${total}`
      }
      className="bg-wine hover:bg-wine-light flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 py-1.5 pr-3 pl-3.5 text-white"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.76L19.5 8H6.2" />
        <circle cx="9.5" cy="19" r="1.3" />
        <circle cx="17" cy="19" r="1.3" />
      </svg>
      <span className="hidden font-sans text-sm font-semibold min-[480px]:inline">
        Mi pedido
      </span>
      {count > 0 && (
        <>
          <motion.span
            key={seq}
            initial={seq && !reduced ? { scale: 1.5 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
            className="bg-orange flex size-6 items-center justify-center rounded-full font-sans text-xs font-bold tabular-nums"
          >
            {count}
          </motion.span>
          <span className="font-display hidden text-sm font-bold tabular-nums min-[640px]:inline">
            {total}
          </span>
        </>
      )}
    </button>
  );
};

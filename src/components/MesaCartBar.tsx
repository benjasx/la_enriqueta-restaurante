import { cartCount, cartTotal } from "@/cart/cartReducer";
import { useCart } from "@/cart/useCart";
import { money } from "@/data/menu";

// Barra flotante del pedido (SPEC 08): resume el carrito y abre el panel.
export const MesaCartBar = ({
  hidden,
  onOpen,
}: {
  hidden: boolean;
  onOpen: () => void;
}) => {
  const { state, dispatch } = useCart();
  const count = cartCount(state.lines);
  if (count === 0 || hidden) return null;

  return (
    <>
      {/* Reserva el alto de la barra para que no tape el final de la página. */}
      <div aria-hidden="true" className="h-24 bg-[#5c0f33]" />
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 px-4">
        <div className="bg-ink pointer-events-auto mx-auto flex max-w-[560px] items-center gap-2 rounded-full py-2 pr-2 pl-[22px] text-white shadow-[0_14px_40px_rgba(58,29,34,0.35)]">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[13px] text-[#d9c3bb]">
              {count} {count === 1 ? "producto" : "productos"}
            </span>
            <span className="font-display text-[19px]">
              {money(cartTotal(state.lines))} MXN
            </span>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: "clear" })}
            className="cursor-pointer border-0 bg-transparent p-2.5 text-[13px] font-medium text-[#d9c3bb]"
          >
            Vaciar
          </button>
          <button
            type="button"
            onClick={onOpen}
            className="bg-green cursor-pointer rounded-full border-0 px-[18px] py-[13px] text-[15px] font-bold whitespace-nowrap text-white"
          >
            Ver pedido
          </button>
        </div>
      </div>
    </>
  );
};

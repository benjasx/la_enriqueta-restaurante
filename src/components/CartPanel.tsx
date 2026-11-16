import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cartMessage } from "@/cart/cartMessage";
import {
  cartTotal,
  hasAlcohol,
  MAX_NOTE,
  MAX_QTY,
  resolveLine,
  type CartLine,
} from "@/cart/cartReducer";
import { validateCustomer } from "@/cart/customer";
import { useCart } from "@/cart/useCart";
import { CustomerForm } from "@/components/CustomerForm";
import { money } from "@/data/menu";
import { whatsappUrl } from "@/data/site";
import { useTable } from "@/table/useTable";

const sizeLabel = { copeo: "Copeo", botella: "Botella" } as const;

const stepper =
  "border-line text-ink hover:border-wine hover:text-wine flex size-9 cursor-pointer items-center justify-center rounded-full border-[1.5px] bg-white text-lg leading-none disabled:cursor-not-allowed disabled:opacity-40";

export const CartPanel = ({ onClose }: { onClose: () => void }) => {
  const { state, dispatch } = useCart();
  const { table, leaveTable } = useTable();
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const [side] = useState(
    () => window.matchMedia?.("(min-width: 768px)").matches ?? false,
  );
  const offscreen = side ? { x: "100%" } : { y: "100%" };
  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.28, ease: "easeOut" as const };

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const empty = state.lines.length === 0;
  const check = validateCustomer(state.customer, table);

  const lineName = (l: CartLine) => {
    const r = resolveLine(l);
    if (!r) return null;
    const detail = [r.option?.label, l.size && sizeLabel[l.size]]
      .filter(Boolean)
      .join(" · ");
    return { name: r.item.name, detail, subtotal: r.unitPrice * l.qty };
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
        className="bg-ink/50 absolute inset-0"
      />
      <motion.div
        role="dialog"
        initial={offscreen}
        animate={{ x: 0, y: 0 }}
        exit={offscreen}
        transition={transition}
        aria-modal="true"
        aria-label="Tu pedido"
        className="bg-cream absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[420px] md:rounded-t-none md:rounded-l-3xl"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="font-display text-wine m-0 text-2xl font-semibold">
            Tu pedido
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar pedido"
            className="text-ink hover:text-wine flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {table !== null && (
            <div className="bg-sand text-wine flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-[13px]">
              <span className="font-semibold">Pedido para la Mesa {table}</span>
              <button
                type="button"
                onClick={leaveTable}
                className="text-muted hover:text-wine cursor-pointer border-0 bg-transparent text-[13px] underline"
              >
                Salir del modo mesa
              </button>
            </div>
          )}
          {state.lines.length === 0 ? (
            <p className="text-body py-10 text-center text-[15px]">
              Tu pedido está vacío. Agrega algo del menú.
            </p>
          ) : (
            <ul className="m-0 list-none p-0">
              {state.lines.map((l) => {
                const info = lineName(l);
                if (!info) return null;
                return (
                  <li
                    key={l.key}
                    className="border-line flex flex-col gap-2 border-b border-dashed py-3"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-ink text-[15px] font-semibold">
                          {info.name}
                        </div>
                        {info.detail && (
                          <div className="text-muted text-[13px]">
                            {info.detail}
                          </div>
                        )}
                      </div>
                      <div className="font-display text-wine shrink-0 font-bold tabular-nums">
                        {money(info.subtotal)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Quitar uno de ${info.name} ${info.detail}`}
                          onClick={() =>
                            dispatch({
                              type: "setQty",
                              key: l.key,
                              qty: l.qty - 1,
                            })
                          }
                          className={stepper}
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center font-semibold tabular-nums">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Agregar uno de ${info.name} ${info.detail}`}
                          disabled={l.qty >= MAX_QTY}
                          onClick={() =>
                            dispatch({
                              type: "setQty",
                              key: l.key,
                              qty: l.qty + 1,
                            })
                          }
                          className={stepper}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "remove", key: l.key })}
                        className="text-muted hover:text-wine cursor-pointer border-0 bg-transparent text-[13px] underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {!empty && (
            <>
              <CustomerForm />
              <label className="flex flex-col gap-1.5 pt-4">
                <span className="text-body text-[13px] font-semibold">
                  Nota del pedido (opcional)
                </span>
                <textarea
                  value={state.note}
                  maxLength={MAX_NOTE}
                  rows={2}
                  onChange={(e) =>
                    dispatch({ type: "setNote", note: e.target.value })
                  }
                  placeholder="Ej. sin cebolla, pozole de pollo…"
                  className="border-line text-ink focus:border-wine w-full resize-none rounded-2xl border-[1.5px] bg-white px-3 py-2 text-[14px] outline-none"
                />
                <span className="text-muted self-end text-[11px] tabular-nums">
                  {state.note.length}/{MAX_NOTE}
                </span>
              </label>
              {hasAlcohol(state.lines) && (
                <p
                  role="note"
                  className="text-wine bg-sand m-0 rounded-2xl px-3 py-2 text-[13px] leading-snug"
                >
                  Tu pedido incluye bebidas alcohólicas: venta solo a mayores de
                  18 años.
                </p>
              )}
            </>
          )}
        </div>

        <div className="border-line flex flex-col gap-3 border-t px-6 pt-4 pb-5">
          <div className="flex items-baseline justify-between">
            <span className="text-body text-[15px] font-semibold">Total</span>
            <span className="font-display text-wine text-2xl font-bold tabular-nums">
              {money(cartTotal(state.lines))}
            </span>
          </div>
          {empty ? (
            <button
              type="button"
              disabled
              className="bg-green text-cream min-h-12 rounded-full border-0 text-sm font-semibold opacity-40"
            >
              Enviar pedido por WhatsApp
            </button>
          ) : !check.ok ? (
            <>
              <button
                type="button"
                disabled
                className="bg-green text-cream min-h-12 rounded-full border-0 text-sm font-semibold opacity-40"
              >
                Enviar pedido por WhatsApp
              </button>
              <p className="text-wine m-0 text-center text-[12px]">
                Falta: {check.missing.join(", ")}.
              </p>
            </>
          ) : (
            <a
              href={whatsappUrl(cartMessage(state, table))}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green text-cream flex min-h-12 items-center justify-center rounded-full text-sm font-semibold"
            >
              Enviar pedido por WhatsApp
            </a>
          )}
          {!empty && (
            <button
              type="button"
              onClick={() => dispatch({ type: "clear" })}
              className="text-muted hover:text-wine cursor-pointer self-center border-0 bg-transparent text-[13px] underline"
            >
              Vaciar pedido
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

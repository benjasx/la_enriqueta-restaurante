import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { resolveLine } from "@/cart/cartReducer";
import { useCart } from "@/cart/useCart";

const sizeLabel = { copeo: "Copeo", botella: "Botella" } as const;
const TOAST_MS = 2000;

export const CartToast = ({ hidden }: { hidden: boolean }) => {
  const { state } = useCart();
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(0);
  const seq = state.lastAdded?.seq ?? 0;

  useEffect(() => {
    if (!seq) return;
    const t = setTimeout(() => setDismissed(seq), TOAST_MS);
    return () => clearTimeout(t);
  }, [seq]);

  const line = state.lines.find((l) => l.key === state.lastAdded?.key);
  const r = line && resolveLine(line);
  const label = r
    ? [r.item.name, r.option?.label, line.size && sizeLabel[line.size]]
        .filter(Boolean)
        .join(" · ")
    : null;
  const show = Boolean(label) && seq !== dismissed && !hidden;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed top-24 right-4 left-4 z-40 flex justify-end"
    >
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
            className="bg-ink text-cream shadow-card max-w-full rounded-full px-4 py-2.5 text-sm font-semibold"
          >
            Agregado: {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

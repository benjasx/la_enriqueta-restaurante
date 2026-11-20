import { AnimatePresence } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { CartProvider } from "@/cart/CartContext";
import { BurroBanner } from "@/components/BurroBanner";
import { CartButton } from "@/components/CartButton";
import { CartPanel } from "@/components/CartPanel";
import { CartToast } from "@/components/CartToast";
import { MesaCartBar } from "@/components/MesaCartBar";
import { MesaHeader } from "@/components/MesaHeader";
import { MesaHero } from "@/components/MesaHero";
import { MesaKaraoke } from "@/components/MesaKaraoke";
import { MesaLocked } from "@/components/MesaLocked";
import { MesaMenu } from "@/components/MesaMenu";
import { readAccess } from "@/table/tableSession";
import { TableContext } from "@/table/useTable";

// Página oculta de mesa: solo se muestra con el código `k` y una mesa `n`
// válidos en la URL; en cualquier otro caso, pantalla neutra.
export const MesaApp = () => {
  const [table] = useState(() =>
    readAccess(window.location.search, import.meta.env.VITE_MESA_KEY),
  );

  const [cartOpen, setCartOpen] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const closeCart = useCallback(() => {
    setCartOpen(false);
    cartButtonRef.current?.focus();
  }, []);

  if (table === null) {
    return (
      <div className="mesa-theme">
        <MesaLocked />
      </div>
    );
  }

  return (
    <div className="mesa-theme">
      <TableContext value={{ table }}>
        <CartProvider>
          <MesaHeader table={table}>
            <CartButton ref={cartButtonRef} onOpen={() => setCartOpen(true)} />
          </MesaHeader>
          <main>
            <MesaHero />
            <BurroBanner menuHref="#especialidades" />
            <MesaMenu />
            <MesaKaraoke />
          </main>
          <MesaCartBar hidden={cartOpen} onOpen={() => setCartOpen(true)} />
          <CartToast hidden={cartOpen} />
          <AnimatePresence>
            {cartOpen && <CartPanel onClose={closeCart} />}
          </AnimatePresence>
        </CartProvider>
      </TableContext>
    </div>
  );
};

import { AnimatePresence } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { CartProvider } from "@/cart/CartContext";
import { About } from "@/components/About";
import { BurroBanner } from "@/components/BurroBanner";
import { CartPanel } from "@/components/CartPanel";
import { CartToast } from "@/components/CartToast";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KaraokeBanner } from "@/components/KaraokeBanner";
import { LocalBanner } from "@/components/LocalBanner";
import { Menu } from "@/components/Menu";
import { MichePromoBanner } from "@/components/MichePromoBanner";

export const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const closeCart = useCallback(() => {
    setCartOpen(false);
    cartButtonRef.current?.focus();
  }, []);

  return (
    <CartProvider>
      <Header
        onOpenCart={() => setCartOpen(true)}
        cartButtonRef={cartButtonRef}
      />
      <main>
        <Hero />
        <BurroBanner menuHref="#menu" />
        <Menu />
        <KaraokeBanner />
        <MichePromoBanner />
        <About />
        <Gallery />
        <LocalBanner />
        <Contact />
      </main>
      <Footer />
      <CartToast hidden={cartOpen} />
      <AnimatePresence>
        {cartOpen && <CartPanel onClose={closeCart} />}
      </AnimatePresence>
    </CartProvider>
  );
};

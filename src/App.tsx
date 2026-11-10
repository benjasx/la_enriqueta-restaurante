import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";

export const App = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Menu />
      <About />
      <Gallery />
      <Contact />
    </main>
    <Footer />
  </>
);

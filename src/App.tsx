import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { site } from "@/data/site";

export const App = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Menu />
      <Gallery />
      <About />
      <Contact />
    </main>
    <footer className="bg-brand-ink py-6 text-center text-sm text-white">
      © {new Date().getFullYear()} {site.name} · {site.tagline}
    </footer>
  </>
);

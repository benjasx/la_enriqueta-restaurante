import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

const galleryImages = (): Plugin => {
  const id = "virtual:gallery-images";
  const resolved = "\0" + id;
  return {
    name: "gallery-images",
    resolveId: (source) => (source === id ? resolved : undefined),
    load: (loaded) =>
      loaded === resolved
        ? `export default ${JSON.stringify(
            readdirSync("public/img")
              .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
              .sort(),
          )};`
        : undefined,
    configureServer(server) {
      const refresh = (file: string) => {
        if (!file.replaceAll("\\", "/").includes("/public/img/")) return;
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.add("public/img");
      for (const ev of ["add", "unlink"] as const)
        server.watcher.on(ev, refresh);
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), galleryImages()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        mesa: fileURLToPath(new URL("./mesa.html", import.meta.url)),
      },
    },
  },
  server: {
    allowedHosts: [".trycloudflare.com"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});

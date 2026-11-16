import { site } from "@/data/site";

export const MesaLocked = () => (
  <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
    <h1 className="font-display text-wine m-0 text-3xl font-semibold">
      {site.name}
    </h1>
    <p className="text-body m-0 max-w-sm text-[16px] leading-snug">
      Escanea el código QR de tu mesa para ver el menú.
    </p>
  </main>
);

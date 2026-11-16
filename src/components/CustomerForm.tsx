import { useState } from "react";
import { customerLimits, type Customer } from "@/cart/cartReducer";
import { mapsUrl, validateCustomer, type CustomerField } from "@/cart/customer";
import { useCart } from "@/cart/useCart";
import { useTable } from "@/table/useTable";

const input =
  "border-line text-ink focus:border-wine w-full rounded-2xl border-[1.5px] bg-white px-3 py-2 text-[14px] outline-none";
const label = "flex flex-col gap-1.5";
const labelText = "text-body text-[13px] font-semibold";
const error = "text-wine m-0 text-[12px] leading-snug";

type Geo = { busy: boolean; message?: string };

const geoMessage = (code: number) => {
  const why =
    code === 1
      ? "No diste permiso de ubicación."
      : code === 3
        ? "Tardó demasiado en obtener tu ubicación."
        : "No pudimos determinar tu ubicación.";
  return `${why} Pega un enlace de Google Maps o las coordenadas.`;
};

export const CustomerForm = () => {
  const {
    state: { customer },
    dispatch,
  } = useCart();
  const { table } = useTable();
  const [touched, setTouched] = useState<
    Partial<Record<CustomerField, boolean>>
  >({});
  const [geo, setGeo] = useState<Geo>({ busy: false });
  const check = validateCustomer(customer);
  const delivery = customer.mode === "domicilio";

  const set = (c: Partial<Customer>) =>
    dispatch({ type: "setCustomer", customer: c });
  const touch = (f: CustomerField) => setTouched((t) => ({ ...t, [f]: true }));
  const shown = (f: CustomerField) =>
    touched[f] ? check.errors[f] : undefined;

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setGeo({
        busy: false,
        message:
          "Tu navegador no permite obtener la ubicación. Pega un enlace de Google Maps o las coordenadas.",
      });
      return;
    }
    setGeo({ busy: true });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({ mapsLink: mapsUrl(pos.coords.latitude, pos.coords.longitude) });
        setGeo({ busy: false });
      },
      (err) => setGeo({ busy: false, message: geoMessage(err.code) }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  if (table !== null) {
    return (
      <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0 pt-4">
        <legend className="font-display text-wine mb-1 p-0 text-lg font-semibold">
          Tu nombre
        </legend>
        <label className={label}>
          <span className={labelText}>Nombre (opcional)</span>
          <input
            type="text"
            autoComplete="given-name"
            maxLength={customerLimits.name}
            value={customer.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Para que el mesero te identifique"
            className={input}
          />
        </label>
        <p className="text-muted m-0 text-[12px] leading-snug">
          Guardamos tu nombre solo en tu dispositivo para tu próximo pedido.
        </p>
      </fieldset>
    );
  }

  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0 pt-4">
      <legend className="font-display text-wine mb-1 p-0 text-lg font-semibold">
        Tus datos de entrega
      </legend>

      <div
        role="radiogroup"
        aria-label="Tipo de entrega"
        className="bg-sand grid grid-cols-2 gap-1 rounded-full p-1"
      >
        {(
          [
            ["domicilio", "A domicilio"],
            ["recoger", "Recoger en el local"],
          ] as const
        ).map(([mode, text]) => (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={customer.mode === mode}
            onClick={() => set({ mode })}
            className={`min-h-10 cursor-pointer rounded-full border-0 px-2 text-[13px] font-semibold ${
              customer.mode === mode
                ? "bg-wine text-white"
                : "text-body bg-transparent"
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      <label className={label}>
        <span className={labelText}>Nombre completo</span>
        <input
          type="text"
          autoComplete="name"
          value={customer.name}
          onChange={(e) => set({ name: e.target.value })}
          onBlur={() => touch("name")}
          aria-invalid={Boolean(shown("name"))}
          placeholder="Nombre y apellido"
          className={input}
        />
        {shown("name") && <p className={error}>{check.errors.name}</p>}
      </label>

      <label className={label}>
        <span className={labelText}>Teléfono</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={customer.phone}
          onChange={(e) => set({ phone: e.target.value })}
          onBlur={() => touch("phone")}
          aria-invalid={Boolean(shown("phone"))}
          placeholder="10 dígitos, ej. 311 123 4567"
          className={input}
        />
        {shown("phone") && <p className={error}>{check.errors.phone}</p>}
      </label>

      {delivery && (
        <>
          <label className={label}>
            <span className={labelText}>Domicilio</span>
            <textarea
              rows={2}
              autoComplete="street-address"
              value={customer.address}
              onChange={(e) => set({ address: e.target.value })}
              onBlur={() => touch("address")}
              aria-invalid={Boolean(shown("address"))}
              placeholder="Calle, número, colonia y referencias"
              className={`${input} resize-none`}
            />
            {shown("address") && (
              <p className={error}>{check.errors.address}</p>
            )}
          </label>

          <div className={label}>
            <label htmlFor="cart-maps" className={labelText}>
              Ubicación de Google Maps (opcional)
            </label>
            <button
              type="button"
              onClick={locate}
              disabled={geo.busy}
              className="border-green text-green hover:bg-green hover:text-cream min-h-10 cursor-pointer rounded-full border-[1.5px] bg-transparent text-[13px] font-semibold disabled:cursor-wait disabled:opacity-60"
            >
              {geo.busy ? "Obteniendo ubicación…" : "Usar mi ubicación"}
            </button>
            <input
              id="cart-maps"
              type="text"
              inputMode="url"
              autoComplete="off"
              value={customer.mapsLink}
              onChange={(e) => {
                set({ mapsLink: e.target.value });
                setGeo({ busy: false });
              }}
              aria-invalid={Boolean(check.errors.mapsLink)}
              placeholder="Pega un enlace de Maps o coordenadas"
              className={input}
            />
            {check.errors.mapsLink && (
              <p className={error}>{check.errors.mapsLink}</p>
            )}
            {geo.message && (
              <p role="alert" className={error}>
                {geo.message}
              </p>
            )}
            {check.location && (
              <a
                href={check.location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green text-[12px] underline"
              >
                Ubicación lista · Ver en Google Maps
              </a>
            )}
            <p className="text-muted m-0 text-[12px] leading-snug">
              En Google Maps mantén pulsado tu punto y copia las coordenadas, o
              usa Compartir → Copiar enlace.
            </p>
          </div>
        </>
      )}

      <p className="text-muted m-0 text-[12px] leading-snug">
        Guardamos estos datos solo en tu dispositivo para tu próximo pedido.
      </p>
    </fieldset>
  );
};

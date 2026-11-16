type Props = { value: string; onChange: (v: string) => void };

export const MenuSearch = ({ value, onChange }: Props) => (
  <div className="relative mx-auto w-full max-w-[1180px]">
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="text-muted pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar platillo…"
      aria-label="Buscar platillo"
      className="bg-sand text-ink placeholder:text-muted focus:ring-wine/40 h-12 w-full rounded-full border-0 pr-12 pl-11 text-[15px] outline-none focus:ring-2 [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        aria-label="Borrar búsqueda"
        onClick={() => onChange("")}
        className="text-body hover:text-wine absolute top-1/2 right-3 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-lg leading-none"
      >
        ×
      </button>
    )}
  </div>
);

export const NoResults = ({ query }: { query: string }) => (
  <p className="text-body mx-auto my-10 max-w-[1180px] text-center text-base">
    No encontramos platillos para “{query.trim()}”.
  </p>
);

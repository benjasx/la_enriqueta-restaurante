type Props = { src?: string; hint: string; alt?: string };

export const Photo = ({ src, hint, alt }: Props) =>
  src ? (
    <img
      src={src}
      alt={alt ?? hint}
      loading="lazy"
      className="size-full object-cover"
    />
  ) : (
    <div
      role="img"
      aria-label={hint}
      className="from-sand to-line text-muted grid size-full place-items-center bg-gradient-to-br p-4 text-center font-sans text-xs font-medium tracking-[0.12em] uppercase"
    >
      {hint}
    </div>
  );

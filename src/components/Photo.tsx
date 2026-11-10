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
      className="text-muted grid size-full place-items-center bg-[#f1e6da] p-3 text-center font-mono text-xs"
    >
      {hint}
    </div>
  );

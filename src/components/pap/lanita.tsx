import lanitaLogo from "@/assets/lanita-logo-oficial.webp.asset.json";

/** Lanita: logo oficial aprobado de PAP de Pam, con Lanita (imagen original, sin modificar). */
export function Lanita({ className = "size-9", decorative = false }: { className?: string; decorative?: boolean }) {
  return (
    <img
      src={lanitaLogo.url}
      alt={decorative ? "" : "Lanita, logo de PAP de Pam, con Lanita"}
      aria-hidden={decorative || undefined}
      width={100}
      height={100}
      className={`shrink-0 rounded-full ${className}`}
      draggable={false}
    />
  );
}

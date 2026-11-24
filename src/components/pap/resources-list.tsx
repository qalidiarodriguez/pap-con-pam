import { Clock, MapPin, Phone } from "lucide-react";
import {
  findResources,
  placeLabel,
  type GuidanceLevel,
  type Place,
  type Resource,
} from "@/lib/resources";

const chipStyles: Record<GuidanceLevel, { label: string; chip: string; dot: string }> = {
  rojo: { label: "Rojo", chip: "border-danger/50 text-danger", dot: "bg-danger" },
  amarillo: {
    label: "Amarillo",
    chip: "border-caution text-caution-foreground",
    dot: "bg-caution",
  },
  verde: { label: "Verde", chip: "border-safe/50 text-safe", dot: "bg-safe" },
};

export function SemaforoChips({ levels }: { levels: readonly GuidanceLevel[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Semáforo en que pedir esta ayuda">
      {levels.map((l) => (
        <li
          key={l}
          className={`flex items-center gap-1.5 rounded-full border-2 bg-card px-3 py-1 text-sm font-bold ${chipStyles[l].chip}`}
        >
          <span className={`size-3 rounded-full ${chipStyles[l].dot}`} aria-hidden />
          {chipStyles[l].label}
        </li>
      ))}
    </ul>
  );
}

export function ResourceCard({ r }: { r: Resource }) {
  return (
    <article
      className={`rounded-2xl border p-4 ${r.emergency ? "border-danger/30 bg-danger-soft" : "border-border bg-card"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans text-lg font-bold leading-snug">{r.name}</h3>
        <span className="shrink-0 rounded-full bg-safe-soft px-2 py-0.5 text-xs font-semibold text-safe">
          Verificado
        </span>
      </div>
      <p className="mt-1 text-muted-foreground">{r.description}</p>
      {r.guidance && (
        <div className="mt-3 rounded-xl bg-card/70 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-secondary-foreground">Pídela en:</span>
            <SemaforoChips levels={r.guidance.levels} />
          </div>
          <p className="mt-2 leading-snug">{r.guidance.help}</p>
        </div>
      )}
      <ul className="mt-2 space-y-1 text-sm">
        <li className="flex gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-lavender-deep" />
          {r.hours}
        </li>
        {r.address && (
          <li className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-lavender-deep" />
            {r.address}
          </li>
        )}
      </ul>
      <a
        href={`tel:${r.tel}`}
        className={`mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-lg font-bold ${r.emergency ? "bg-danger text-danger-foreground" : "bg-bougainvillea text-primary-foreground"}`}
      >
        <Phone className="size-5" />
        Llamar {r.phone}
      </a>
    </article>
  );
}

export function ResourceList({ place }: { place: Place }) {
  const { resources, needsVerification } = findResources(place);
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Recursos para: <strong className="text-foreground">{placeLabel(place) || "sin lugar"}</strong>
      </p>
      {resources.map((r) => (
        <ResourceCard key={r.id} r={r} />
      ))}
      {needsVerification && (
        <div className="rounded-2xl border border-dashed border-caution bg-caution-soft p-4 text-caution-foreground">
          <p className="font-bold">Otros recursos de este lugar: por verificar</p>
          <p className="mt-1 text-sm">
            Aún no tenemos datos verificados de servicios locales aquí, así que no mostramos teléfonos
            que no hayamos confirmado. Busca el número de emergencias oficial de tu país y el centro
            de salud o de salud mental más cercano.
          </p>
        </div>
      )}
    </div>
  );
}

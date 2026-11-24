import { createFileRoute } from "@tanstack/react-router";
import { Search, Stethoscope } from "lucide-react";
import { useState } from "react";
import { ResourceList } from "@/components/pap/resources-list";
import { SinInternetCard } from "@/components/pap/sin-internet-card";
import { Page, PageHeader } from "@/components/pap/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlace } from "@/lib/place-context";
import { DEFAULT_PLACE, type Place } from "@/lib/resources";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "Recursos cerca de mí — PAP de Pam, con Lanita" },
      {
        name: "description",
        content:
          "Líneas de ayuda y centros de salud mental verificados. Empezando por Mérida, Yucatán, México: 911, Línea de la Vida, Línea Amiga, AlmaNova y CISAME.",
      },
      { property: "og:title", content: "Recursos cerca de mí — PAP de Pam, con Lanita" },
      { property: "og:description", content: "Busca apoyos verificados por ciudad, estado y país." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Recursos,
});

function Recursos() {
  const { place, setPlace } = usePlace();
  const [form, setForm] = useState<Place>(place);
  return (
    <Page>
      <PageHeader
        eyebrow="Apoyo real"
        title="Recursos cerca de mí"
        intro="Solo mostramos datos verificados. Lo que no hemos confirmado aparece como “por verificar”, sin teléfonos inventados."
      />
      <form
        className="mb-5 space-y-2 rounded-3xl border border-lavender bg-secondary p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setPlace({ city: form.city.trim(), state: form.state.trim(), country: form.country.trim() });
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Field label="Ciudad" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Field label="Estado" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
        </div>
        <Field label="País" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="hero" size="xl" className="flex-1">
            <Search /> Buscar
          </Button>
          <Button
            type="button"
            variant="soft"
            size="xl"
            onClick={() => {
              setForm(DEFAULT_PLACE);
              setPlace(DEFAULT_PLACE);
            }}
          >
            Mérida
          </Button>
        </div>
      </form>
      <p className="mb-4 rounded-2xl border border-lavender bg-lavender-wash p-4 text-lg font-semibold leading-snug text-secondary-foreground">
        No tienes que saber qué decir para pedir ayuda. Elige el recurso según cómo te sientes ahora,
        y si es una emergencia, llama al{" "}
        <a href="tel:911" className="font-bold text-danger underline underline-offset-2">
          911
        </a>
        .
      </p>
      <ResourceList place={place} />
      <ProfesionalesButton />
      <div className="mt-6">
        <SinInternetCard />
      </div>
    </Page>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-secondary-foreground">{label}</span>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-12 rounded-xl bg-card text-base" />
    </label>
  );
}

function ProfesionalesButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 space-y-3">
      <Button
        type="button"
        size="lg"
        className="min-h-14 w-full rounded-2xl text-lg font-bold"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Stethoscope className="size-5" /> Profesionales de salud mental
      </Button>
      {open && (
        <div role="status" className="animate-rise rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-lg font-bold">Próximamente</p>
          <p className="mt-1">
            Estamos preparando un directorio de profesionales verificados de salud mental. Por
            ahora, si necesitas ayuda, usa los recursos de esta pantalla.
          </p>
        </div>
      )}
    </div>
  );
}

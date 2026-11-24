import { createFileRoute, Link } from "@tanstack/react-router";
import { BatteryLow, Bed, HandHelping, ShieldCheck, Stethoscope, Timer, TrafficCone, Wind } from "lucide-react";
import { useState } from "react";
import { Breathing } from "@/components/pap/breathing";
import { CopyPhrase } from "@/components/pap/copy-button";
import { Semaforo } from "@/components/pap/semaforo";
import { Page, PageHeader, Section } from "@/components/pap/shell";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/cuidadores")({
  head: () => ({
    meta: [
      { title: "Yo cuido a otros — PAP de Pam, con Lanita" },
      {
        name: "description",
        content:
          "Claridad y autocuidado para cuidadores: reconocer el cansancio, poner límites sin culpa, pedir ayuda y descansar.",
      },
      { property: "og:title", content: "Yo cuido a otros — PAP de Pam, con Lanita" },
      {
        property: "og:description",
        content: "Un espacio de claridad, límites y autocuidado para quienes cuidan a otros.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cuidadores,
});

const tiredSigns = [
  "Te cuesta dormir o despiertas sin descansar.",
  "Te irritas con facilidad o lloras sin saber por qué.",
  "Dejas de hacer cosas que antes disfrutabas.",
  "Sientes culpa cuando descansas.",
  "Dolores de cabeza, espalda o estómago frecuentes.",
  "Sientes que nadie más puede hacerlo.",
];

const limitPhrases = [
  "Hoy puedo ayudarte hasta las 6. Después necesito descansar.",
  "Me importas, y por eso necesito cuidarme también.",
  "Esta vez no puedo. ¿Buscamos a alguien más que pueda?",
];

const askPhrases = [
  "¿Podrías quedarte con … el sábado por la mañana? Necesito unas horas para mí.",
  "Estoy muy cansada o cansado. ¿Me ayudas con la comida esta semana?",
];

const tips = [
  "Tomar agua y comer a mis horas",
  "Dormir o recostarme al menos un rato",
  "Salir a caminar 10 minutos",
  "Hablar con alguien que no dependa de mí",
  "Hacer algo que me guste, aunque sea poco",
  "Decir “no” a algo que no me toca",
  "Pedir una ayuda concreta",
  "Apagar el teléfono un rato",
];

function Cuidadores() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;
  return (
    <Page>
      <PageHeader
        eyebrow="Espacio 3"
        title="Yo cuido a otros"
        intro="Cuidar a otros es valioso, y tú también mereces cuidado. Aquí hay claridad, límites y pausas para ti."
      />

      <Section title="Reconoce el cansancio" icon={<BatteryLow className="size-5 text-primary" />}>
        <ul className="list-disc space-y-1.5 pl-5">
          {tiredSigns.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">Si te reconoces en varias, no es debilidad: es una señal para parar.</p>
      </Section>

      <Section title="Pon límites sin culpa" icon={<ShieldCheck className="size-5 text-primary" />} tone="lavender">
        <p>Un límite no es egoísmo. Es lo que te permite seguir cuidando sin romperte.</p>
        {limitPhrases.map((p) => (
          <CopyPhrase key={p} text={p} />
        ))}
      </Section>

      <Section title="Pide ayuda" icon={<HandHelping className="size-5 text-primary" />}>
        <p>Pide algo concreto: un día, una hora, una tarea. Es más fácil decir que sí.</p>
        {askPhrases.map((p) => (
          <CopyPhrase key={p} text={p} />
        ))}
      </Section>

      <Section title="Descansa" icon={<Bed className="size-5 text-primary" />} tone="gold">
        <p>Descansar no es un premio que se gana; es una necesidad. Aunque sean 15 minutos, cuentan.</p>
      </Section>

      <Section title="Respira y haz una pausa corta" icon={<Wind className="size-5 text-primary" />}>
        <Breathing />
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="flex items-center gap-2 font-bold">
            <Timer className="size-5 text-lavender-deep" /> Pausa de 1 minuto: 5-4-3-2-1
          </p>
          <p className="mt-1 text-sm">
            Nombra 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles y 1 que agradeces.
          </p>
        </div>
      </Section>

      <Section title="Mi lista de autocuidado" tone="lavender">
        <p className="text-sm text-secondary-foreground">Marca lo que hiciste hoy. Sin presión: una sola ya cuenta.</p>
        <ul className="space-y-2">
          {tips.map((t) => (
            <li key={t}>
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl bg-card px-4 py-2">
                <Checkbox
                  checked={!!done[t]}
                  onCheckedChange={(v) => setDone((d) => ({ ...d, [t]: v === true }))}
                  className="size-5"
                />
                <span className={done[t] ? "text-muted-foreground line-through" : ""}>{t}</span>
              </label>
            </li>
          ))}
        </ul>
        {count > 0 && (
          <p className="font-semibold text-primary">
            {count} {count === 1 ? "cuidado" : "cuidados"} para ti hoy. Bien hecho.
          </p>
        )}
      </Section>

      <Section title="Cuándo buscar apoyo profesional para ti" icon={<Stethoscope className="size-5 text-primary" />}>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Si el cansancio o la tristeza duran más de dos semanas.</li>
          <li>Si ya no puedes dormir, comer o funcionar en tu día.</li>
          <li>Si sientes que vas a explotar o a lastimar a alguien.</li>
          <li>Si piensas en hacerte daño: es rojo, llama al 911 o a la Línea de la Vida 800 911 2000.</li>
        </ul>
        <Link to="/recursos" className="inline-block font-bold text-primary underline underline-offset-4">
          Ver recursos verificados
        </Link>
      </Section>

      <Section title="Semáforo de derivación" icon={<TrafficCone className="size-5 text-primary" />}>
        <Semaforo />
      </Section>
    </Page>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CopyButton } from "@/components/pap/copy-button";
import { Page, PageHeader } from "@/components/pap/shell";

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "Prompts para tu propia IA — PAP de Pam, con Lanita" },
      {
        name: "description",
        content: "Dos prompts listos para copiar: uno para recibir Primeros Auxilios Psicológicos y otro para ayudar a alguien más.",
      },
      { property: "og:title", content: "Prompts para tu propia IA — PAP de Pam, con Lanita" },
      { property: "og:description", content: "Copia y pega en tu asistente de IA para recibir o dar PAP con límites claros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Prompts,
});

const RECIBIR = `Actúa como acompañante de Primeros Auxilios Psicológicos (PAP) con el modelo Mirar, Escuchar, Conectar. Háblame en español latinoamericano, con calidez, frases cortas y sin presionarme.

Reglas:
- No diagnostiques, no recetes medicamentos y no hagas terapia. Recuérdame que eso solo lo hacen profesionales humanos.
- Primero pregúntame, con cuidado, si estoy en peligro o si he pensado en hacerme daño.
- Si hay riesgo de hacerme daño, un plan o intento, urgencia médica, violencia o pérdida de contacto con la realidad: detente y dime que llame al 911 o a la Línea de la Vida 800 911 2000 (México), que busque a alguien que se quede conmigo y que acuda a urgencias.
- Escúchame sin juzgar, pregúntame cómo me siento y qué necesito (agua, comida, descanso, un lugar seguro).
- Guíame en una respiración lenta de 4 segundos al inhalar y 4 al exhalar.
- Ayúdame a pensar en una persona de confianza a quien escribir hoy.
- No inventes teléfonos ni direcciones; si no sabes un recurso local, dime que debo verificarlo.

Estoy en: [ciudad, estado, país]. Lo que me pasa es: [escribe aquí si quieres].`;

const AYUDAR = `Quiero ayudar a una persona que está pasando por una crisis. Guíame como instructor de Primeros Auxilios Psicológicos (PAP) con el modelo Mirar, Escuchar, Conectar, en español latinoamericano, claro y breve.

Reglas:
- No diagnostiques ni recomiendes medicamentos o terapia; mi papel es acompañar y conectar con profesionales.
- Primero ayúdame a revisar la seguridad: ¿hay riesgo de que se haga daño, un plan o intento, urgencia médica, violencia o pérdida de contacto con la realidad? Si es así, dime que llame al 911 o a la Línea de la Vida 800 911 2000 (México) y que no deje sola a la persona.
- Dame frases concretas de qué decir y qué no decir.
- Ayúdame a escuchar sin presionar y a identificar sus necesidades básicas.
- Ayúdame a conectarla con alguien de confianza o con un servicio profesional. No inventes teléfonos ni direcciones.
- Recuérdame cuidar mis propios límites.

La situación es: [describe brevemente]. Estamos en: [ciudad, estado, país].`;

function Prompts() {
  return (
    <Page>
      <PageHeader
        eyebrow="Para llevar"
        title="Prompts para tu propia IA"
        intro="Copia y pega en el asistente de IA que uses. Incluyen límites claros y el semáforo de derivación. Ninguna IA sustituye a un profesional."
      />
      <PromptCard title="1. Para recibir PAP" text={RECIBIR} tone="bg-primary-soft border-primary/25" />
      <PromptCard title="2. Para ayudar a otra persona" text={AYUDAR} tone="bg-secondary border-lavender" />
    </Page>
  );
}

function PromptCard({ title, text, tone }: { title: string; text: string; tone: string }) {
  return (
    <section className={`mb-4 rounded-3xl border p-5 shadow-soft ${tone}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <CopyButton text={text} label="Copiar prompt" />
      </div>
      <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-card p-4 font-sans text-sm leading-relaxed">
        {text}
      </pre>
    </section>
  );
}

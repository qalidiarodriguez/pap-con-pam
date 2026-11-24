import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Ear, Eye, Link2, MessageCircleHeart, MessageCircleX, Target, TrafficCone, XCircle } from "lucide-react";
import { useState } from "react";
import { CopyPhrase } from "@/components/pap/copy-button";
import { Page, PageHeader, Section } from "@/components/pap/shell";
import { Semaforo } from "@/components/pap/semaforo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ayudar")({
  head: () => ({
    meta: [
      { title: "Quiero ayudar a alguien — PAP de Pam, con Lanita" },
      {
        name: "description",
        content:
          "Guía paso a paso para acompañar a alguien en crisis: Mirar, Escuchar, Conectar. Qué decir, qué no decir y escenarios para practicar.",
      },
      { property: "og:title", content: "Quiero ayudar a alguien — PAP de Pam, con Lanita" },
      {
        property: "og:description",
        content: "Aprende a acompañar a una persona en crisis con Primeros Auxilios Psicológicos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ayudar,
});

const steps = [
  {
    icon: Eye,
    title: "1. Mirar",
    items: [
      "Revisa que el lugar sea seguro para ti y para la persona.",
      "Observa si hay heridas, urgencia médica o peligro inmediato.",
      "Nota reacciones fuertes: llanto intenso, confusión, mucho miedo o enojo.",
    ],
  },
  {
    icon: Ear,
    title: "2. Escuchar",
    items: [
      "Preséntate con calma y pregunta si puedes acompañar.",
      "Escucha sin presionar ni interrumpir. El silencio también acompaña.",
      "Pregunta qué necesita ahora: agua, sentarse, llamar a alguien.",
      "Ayuda a bajar el ritmo: respirar juntos, despacio.",
    ],
  },
  {
    icon: Link2,
    title: "3. Conectar",
    items: [
      "Ayuda a contactar a una persona de confianza.",
      "Comparte información clara y verificada de servicios de apoyo.",
      "Ayuda a cubrir necesidades básicas y a resolver lo urgente, paso a paso.",
      "No te quedes con lo que no te toca: deriva a profesionales.",
    ],
  },
];

const doSay = [
  "Estoy aquí contigo.",
  "Lo que sientes tiene sentido.",
  "No tienes que hablar si no quieres.",
  "¿Qué necesitas en este momento?",
  "Vamos paso a paso.",
];
const dontSay = [
  "“No llores” o “cálmate”.",
  "“Todo pasa por algo”.",
  "“Otros están peor”.",
  "Contar tu propia historia en lugar de escuchar.",
  "Prometer cosas que no puedes cumplir.",
  "Diagnosticar, recetar o dar terapia.",
];

const phrases = [
  "Hola, soy … ¿Puedo quedarme contigo un momento?",
  "No tienes que contarme nada si no quieres. Aquí estoy.",
  "Gracias por decírmelo. Debe ser muy difícil.",
  "¿Hay alguien de confianza a quien quieras llamar?",
  "¿Estás pensando en hacerte daño? Puedes decírmelo, estoy contigo.",
  "Vamos a buscar juntos apoyo profesional.",
];

interface Scenario {
  title: string;
  situation: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

const scenarios: Scenario[] = [
  {
    title: "Escenario 1 · En el trabajo",
    situation:
      "Tu compañera llora en el baño después de recibir una mala noticia familiar. Te ve entrar y baja la mirada.",
    options: [
      {
        text: "“Ya no llores, todo pasa por algo.”",
        correct: false,
        feedback: "Minimiza lo que siente. Aunque la intención sea buena, puede hacerla sentir incomprendida.",
      },
      {
        text: "“Estoy aquí. ¿Quieres que me quede contigo un momento?”",
        correct: true,
        feedback: "Muy bien. Ofreces presencia sin presionar y le das la opción de decidir. Esto es Escuchar.",
      },
      {
        text: "“A mí me pasó algo igual, te cuento…”",
        correct: false,
        feedback: "Pone el centro en ti. Primero escucha; tu historia puede esperar.",
      },
    ],
  },
  {
    title: "Escenario 2 · En la calle",
    situation:
      "Después de un choque leve, tu vecino está muy agitado, dice que le duele el pecho y que no puede respirar bien.",
    options: [
      {
        text: "Solo respirar con él hasta que se calme.",
        correct: false,
        feedback: "Respirar ayuda, pero el dolor de pecho puede ser una urgencia médica. Es semáforo rojo.",
      },
      {
        text: "Llamar al 911, quedarte con él y hablarle con calma mientras llega la ayuda.",
        correct: true,
        feedback: "Correcto. Mirar incluye detectar urgencias médicas. Primero la seguridad, luego el acompañamiento.",
      },
      {
        text: "Dejarlo solo para que se tranquilice.",
        correct: false,
        feedback: "Nunca dejes sola a una persona en posible urgencia. Llama al 911 y quédate.",
      },
    ],
  },
  {
    title: "Escenario 3 · Por mensaje",
    situation: "Un amigo te escribe de noche: “Ya no aguanto, siento que nadie me necesita.”",
    options: [
      {
        text: "“¡Ánimo, tú puedes! Mañana lo verás distinto.”",
        correct: false,
        feedback: "Suena alentador, pero cierra la conversación y puede pasar por alto una señal de riesgo.",
      },
      {
        text: "“Gracias por decírmelo. ¿Estás pensando en hacerte daño? Estoy contigo y quiero ayudarte a buscar apoyo.”",
        correct: true,
        feedback:
          "Muy bien. Preguntar directo no provoca la idea; abre la puerta a pedir ayuda. Si dice que sí: semáforo rojo, 911 o Línea de la Vida 800 911 2000, y no lo dejes solo.",
      },
      {
        text: "Cambiar de tema para distraerlo.",
        correct: false,
        feedback: "Evitar el tema puede hacerlo sentir más solo. Nombra lo que notas, con cuidado.",
      },
    ],
  },
];

function Ayudar() {
  return (
    <Page>
      <PageHeader
        eyebrow="Espacio 2"
        title="Quiero ayudar a alguien"
        intro="No necesitas ser profesional para acompañar con calma. Tu papel es estar, escuchar y conectar con ayuda; no resolverlo todo."
      />

      {steps.map(({ icon: Icon, title, items }) => (
        <Section key={title} title={title} icon={<Icon className="size-5 text-primary" />}>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it} className="flex gap-2">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-safe" />
                {it}
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Section title="Qué decir" icon={<MessageCircleHeart className="size-5 text-safe" />} tone="lavender">
        <ul className="space-y-1.5">
          {doSay.map((d) => (
            <li key={d} className="flex gap-2">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-safe" />“{d}”
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Qué no decir ni hacer" icon={<MessageCircleX className="size-5 text-danger" />} tone="rose">
        <ul className="space-y-1.5">
          {dontSay.map((d) => (
            <li key={d} className="flex gap-2">
              <XCircle className="mt-1 size-4 shrink-0 text-danger" />
              {d}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Frases para copiar">
        {phrases.map((p) => (
          <CopyPhrase key={p} text={p} />
        ))}
      </Section>

      <Section title="Ejemplo breve" tone="gold">
        <div className="space-y-2 text-sm">
          <p><strong>Tú:</strong> “Hola, veo que estás pasando un mal momento. ¿Puedo sentarme aquí?”</p>
          <p><strong>Persona:</strong> “No sé qué hacer, todo se vino abajo.”</p>
          <p><strong>Tú:</strong> “Suena muy difícil. Estoy aquí. ¿Qué necesitas ahora mismo?”</p>
          <p><strong>Persona:</strong> “Quiero hablar con mi hermana.”</p>
          <p><strong>Tú:</strong> “Te ayudo a llamarla. Mientras, ¿respiramos juntos un momento?”</p>
        </div>
      </Section>

      <Section title="Practica con 3 escenarios" icon={<Target className="size-5 text-primary" />}>
        <div className="space-y-4">
          {scenarios.map((s) => (
            <ScenarioCard key={s.title} s={s} />
          ))}
        </div>
      </Section>

      <Section title="Semáforo de derivación" icon={<TrafficCone className="size-5 text-primary" />}>
        <Semaforo />
      </Section>

      <Section title="Cuándo derivar a un profesional" tone="lavender">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Si aparece cualquier señal de alarma: de inmediato (rojo).</li>
          <li>Si el malestar dura más de dos semanas o va en aumento (amarillo).</li>
          <li>Si la persona no puede con su vida diaria: comer, dormir, trabajar, cuidar a otros.</li>
          <li>Si tú te sientes rebasado o rebasada. Cuidar tu límite también es cuidar.</li>
        </ul>
      </Section>
    </Page>
  );
}

function ScenarioCard({ s }: { s: Scenario }) {
  const [picked, setPicked] = useState<number | null>(null);
  const choice = picked !== null ? s.options[picked] : undefined;
  return (
    <div className="rounded-2xl border border-lavender bg-background p-4">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">{s.title}</p>
      <p className="mt-1">{s.situation}</p>
      <p className="mt-3 text-sm font-semibold text-muted-foreground">¿Qué harías?</p>
      <div className="mt-3 space-y-3">
        {s.options.map((o, i) => (
          <Button
            key={o.text}
            variant="chip"
            className={`h-auto w-full justify-start rounded-2xl px-4 py-3 text-base ${picked === i ? (o.correct ? "border-safe bg-safe-soft hover:bg-safe-soft" : "border-danger bg-danger-soft hover:bg-danger-soft") : ""}`}
            onClick={() => setPicked(i)}
          >
            {o.text}
          </Button>
        ))}
      </div>
      {choice && (
        <div
          role="status"
          className={`mt-3 animate-rise rounded-2xl p-3 ${choice.correct ? "bg-safe-soft" : "bg-caution-soft text-caution-foreground"}`}
        >
          <p className="font-bold">{choice.correct ? "¡Bien hecho!" : "Vale la pena revisarlo"}</p>
          <p className="text-sm">{choice.feedback}</p>
        </div>
      )}
    </div>
  );
}

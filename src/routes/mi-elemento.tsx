import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb, Scale, Sun } from "lucide-react";
import { useState } from "react";
import { Page, PageHeader, Section } from "@/components/pap/shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/mi-elemento")({
  validateSearch: (s: Record<string, unknown>): { calma?: boolean } =>
    s["calma"] === true || s["calma"] === "true" || s["calma"] === 1 ? { calma: true } : {},
  head: () => ({
    meta: [
      { title: "Mi elemento — PAP de Pam, con Lanita" },
      {
        name: "description",
        content:
          "Después de la calma: explora con suavidad tus habilidades, gustos y un primer paso pequeño. Inspirado en “El Elemento” de Ken Robinson.",
      },
      { property: "og:title", content: "Mi elemento — PAP de Pam, con Lanita" },
      {
        property: "og:description",
        content: "Donde se encuentran tu aptitud natural y tu pasión. Opcional y sin presión.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MiElemento,
});

const questions = [
  { id: "aptitud", q: "¿Qué se te da bien, aunque te parezca pequeño?", hint: "Escuchar, cocinar, arreglar cosas, dibujar, organizar…" },
  { id: "gusto", q: "¿Qué te gusta tanto que se te pasa el tiempo?", hint: "Algo que harías aunque nadie te lo pidiera." },
  { id: "hobby", q: "¿Tienes algún pasatiempo, o alguno que dejaste?", hint: "A veces lo que nos gustaba de niños sigue ahí." },
  { id: "luz", q: "¿Qué te da luz y paz?", hint: "Un lugar, una actividad, una persona, un sonido." },
  { id: "herramientas", q: "¿Qué tienes realmente disponible hoy?", hint: "En tu casa, en tu teléfono o en tu comunidad: una libreta, videos gratis, un parque, una biblioteca, un vecino que sabe." },
] as const;

const smallSteps = [
  "Dedicarle 10 minutos hoy",
  "Ver un video gratuito para aprender lo básico",
  "Preguntarle a alguien que ya lo hace",
  "Apuntarlo en una libreta para no olvidarlo",
];

function MiElemento() {
  const { calma } = Route.useSearch();
  const [calm, setCalm] = useState<boolean | null>(calma ? true : null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ethic, setEthic] = useState<"si" | "no" | null>(null);
  const [step, setStep] = useState("");

  return (
    <Page>
      <PageHeader
        eyebrow="Después de la calma · Opcional"
        title="Mi elemento"
        intro={
          <>
            Ken Robinson, en <em>El Elemento</em> (2009), lo describe como el punto donde se encuentran la{" "}
            <strong className="text-foreground">aptitud natural</strong> y la{" "}
            <strong className="text-foreground">pasión</strong>. Aquí no hay respuestas correctas ni prisa.
          </>
        }
      />

      {calm === null && (
        <Section title="Antes de empezar" tone="lavender">
          <p>¿Te sientes más tranquila o tranquilo en este momento?</p>
          <div className="grid gap-3">
            <Button variant="hero" size="xl" onClick={() => setCalm(true)}>
              Sí, me siento más tranquilo(a)
            </Button>
            <Button variant="soft" size="xl" onClick={() => setCalm(false)}>
              Todavía no
            </Button>
          </div>
        </Section>
      )}

      {calm === false && (
        <Section title="Primero, la calma" tone="rose">
          <p>Está bien. Esto puede esperar. Ahora lo importante eres tú y tu tranquilidad.</p>
          <Button asChild variant="hero" size="xl" className="w-full">
            <Link to="/contencion">Ir a “Necesito contención”</Link>
          </Button>
        </Section>
      )}

      {calm === true && (
        <>
          <Section title="Ayuda: un ejemplo" icon={<Lightbulb className="size-5 text-gold-foreground" />} tone="gold">
            <p>
              Aprender poco a poco cómo hacer algo que amas también puede dar luz y paz.
            </p>
            <p className="text-sm">
              Por ejemplo: si te gusta cocinar, buscar una receta sencilla en tu teléfono y prepararla con lo
              que ya tienes en casa. Un paso pequeño, sin presión.
            </p>
          </Section>

          <Section title="Preguntas suaves" icon={<Sun className="size-5 text-primary" />}>
            <p className="text-sm text-muted-foreground">Responde solo las que quieras. Nada se guarda ni se envía.</p>
            {questions.map((q) => (
              <label key={q.id} className="block">
                <span className="font-semibold">{q.q}</span>
                <span className="block text-sm text-muted-foreground">{q.hint}</span>
                <Textarea
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  className="mt-1.5 min-h-20 rounded-2xl bg-background text-base"
                />
              </label>
            ))}
          </Section>

          <Section title="Filtro ético" icon={<Scale className="size-5 text-lavender-deep" />} tone="lavender">
            <p className="font-display text-xl font-semibold">¿Esto me trae bienestar y no daña a nadie?</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant={ethic === "si" ? "hero" : "chip"} size="xl" onClick={() => setEthic("si")}>
                Sí
              </Button>
              <Button variant={ethic === "no" ? "danger" : "chip"} size="xl" onClick={() => setEthic("no")}>
                No
              </Button>
            </div>
            {ethic === "no" && (
              <p className="rounded-2xl bg-card p-3">
                Entonces no sigamos por ahí. Está bien soltarlo. Puedes volver a las preguntas y buscar otra cosa que te
                dé luz sin dañar a nadie, incluyéndote.
              </p>
            )}
          </Section>

          {ethic === "si" && (
            <Section title="Un primer paso pequeño" tone="gold">
              <p>¿Qué es lo más pequeño que podrías hacer esta semana? Pequeño de verdad.</p>
              <div className="flex flex-wrap gap-3">
                {smallSteps.map((s) => (
                  <Button key={s} variant="chip" size="chip" onClick={() => setStep(s)}>
                    {s}
                  </Button>
                ))}
              </div>
              <Textarea
                value={step}
                onChange={(e) => setStep(e.target.value)}
                placeholder="Mi primer paso es…"
                className="min-h-16 rounded-2xl bg-card text-base"
              />
              {step.trim() !== "" && (
                <div className="animate-rise rounded-2xl bg-card p-4 shadow-soft">
                  <p className="text-sm font-bold uppercase tracking-wide text-primary">Mi primer paso</p>
                  <p className="mt-1 font-display text-xl">{step}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Si un día no puedes, no pasa nada. Se vale ir despacio y volver a empezar.
                  </p>
                </div>
              )}
            </Section>
          )}
        </>
      )}
    </Page>
  );
}

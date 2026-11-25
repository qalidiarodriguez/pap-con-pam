import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, RotateCcw, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Breathing } from "@/components/pap/breathing";
import { CopyPhrase } from "@/components/pap/copy-button";
import { Lanita } from "@/components/pap/lanita";
import { ResourceList } from "@/components/pap/resources-list";
import { RedAlert } from "@/components/pap/semaforo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlace } from "@/lib/place-context";
import { DEFAULT_PLACE, findResources, placeLabel, type Place } from "@/lib/resources";
import { detectRedFlags, type Level } from "@/lib/triage";
import { TherapistSummary } from "@/components/pap/therapist-summary";
import { addUnique, emptyRecord, type SectionKey, type SharedRecord } from "@/lib/therapist-summary";

export const Route = createFileRoute("/contencion")({
  head: () => ({
    meta: [
      { title: "Necesito contención — PAP de Pam, con Lanita" },
      {
        name: "description",
        content:
          "Chat privado y guiado de Primeros Auxilios Psicológicos. Sin nombre ni registro. Con recursos verificados cerca de ti.",
      },
      { property: "og:title", content: "Necesito contención — PAP de Pam, con Lanita" },
      {
        property: "og:description",
        content: "Un espacio privado y guiado para recibir contención paso a paso, sin registro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contencion,
});

type Step =
  | "lugar"
  | "escucha"
  | "sentir"
  | "seguridad"
  | "urgencia"
  | "necesidades"
  | "respirar"
  | "conectar"
  | "cierre"
  | "peor"
  | "resumen"
  | "oferta"
  | "fin"
  | "rojo";

type Widget = "recursos" | "mensaje" | "amarillo";

interface Msg {
  id: number;
  from: "pam" | "yo";
  text?: string;
  widget?: Widget;
}

const PROMPTS: Record<Step, string[]> = {
  lugar: [
    "Hola. Estoy aquí contigo. No necesitas darme tu nombre ni registrarte.",
    "Para tener a la mano apoyos reales cerca de ti, ¿en qué ciudad, estado y país estás?",
  ],
  escucha: [
    "Si quieres, cuéntame qué está pasando. Escribe lo que necesites, a tu ritmo.",
    "También está bien no decir nada todavía. Aquí no hay prisa.",
  ],
  sentir: ["¿Cómo te sientes en este momento? Puedes elegir una opción o escribirlo."],
  seguridad: [
    "Quiero preguntarte algo importante, con cuidado: ¿estás en peligro ahora mismo, o has pensado en hacerte daño?",
  ],
  urgencia: ["¿Hay alguna urgencia médica, o alguien te está lastimando en este momento?"],
  necesidades: [
    "Vamos a lo básico. Muchas veces el cuerpo pide cosas simples. ¿Necesitas algo de esto ahora?",
  ],
  respirar: ["¿Respiramos juntos un minuto? Puedes parar cuando quieras."],
  conectar: [
    "No tienes que pasar por esto sin compañía. ¿Hay alguien de confianza a quien puedas escribir o llamar hoy?",
  ],
  cierre: ["Un momento antes de seguir: ¿cómo te sientes ahora, comparado con cuando llegaste?"],
  peor: [
    "Gracias por decírmelo. ¿Sientes que podrías hacerte daño o que no puedes mantenerte a salvo?",
  ],
  resumen: [
    "Si te sirve, puedo preparar un resumen en PDF de lo que compartiste aquí, para que se lo des a tu terapeuta. Es opcional. Tú eliges qué incluir y se descarga solo en tu teléfono.",
  ],
  oferta: [
    "Si quieres —solo si quieres— podemos explorar algo que te dé luz: lo que se te da bien y lo que te gusta. Lo llamamos “Mi elemento”. No hay ninguna prisa.",
  ],
  fin: [
    "Gracias por quedarte este rato. Puedes volver aquí cuando lo necesites.",
    "Recuerda: esta app no sustituye a un profesional. Pedir ayuda es un acto de valentía.",
  ],
  rojo: [
    "Lo que me cuentas es muy importante y necesita ayuda humana inmediata.",
    "Ya no es momento de seguir solo con esta guía. Por favor, llama ahora y busca a alguien que se quede contigo.",
  ],
};

const FEELINGS: { label: string; reply: string }[] = [
  { label: "Con miedo", reply: "El miedo es una reacción natural cuando algo nos sobrepasa. No estás exagerando." },
  { label: "Triste", reply: "La tristeza pesa. Gracias por dejarla salir aquí. No tienes que cargarla sin compañía." },
  { label: "Con enojo", reply: "El enojo también es válido. Muchas veces nos dice que algo nos dolió o no fue justo." },
  { label: "Confundida o confundido", reply: "Cuando todo se revuelve, es normal no tener claridad. Vamos con calma." },
  { label: "Agotada o agotado", reply: "Se nota que has cargado mucho. Por ahora, solo vamos a lo más básico." },
  { label: "Muy acelerada o acelerado", reply: "Cuando el cuerpo va muy rápido, ayuda bajar el ritmo. En un momento respiramos juntos." },
  { label: "No sé", reply: "Está bien no saberlo. A veces solo sentimos que algo no está bien, y eso basta." },
];

const NEEDS: { label: string; reply: string; caution?: boolean }[] = [
  { label: "Agua o comida", reply: "Si puedes, toma unos sorbos de agua, despacio. Si no has comido, algo sencillo ayuda al cuerpo a sostenerte." },
  { label: "Un lugar seguro", reply: "Tu seguridad va primero. Si donde estás te pueden lastimar, busca ir a un sitio con más gente. Si hay peligro, llama al 911.", caution: true },
  { label: "Descansar", reply: "Descansar no es rendirse. Si puedes, siéntate o recuéstate, afloja los hombros y suelta la mandíbula." },
  { label: "Hablar con alguien", reply: "Tiene mucho sentido. En un momento buscamos juntos a alguien con quien hablar." },
  { label: "Estoy bien en eso", reply: "Qué bueno. Eso ya es una base firme." },
];

let nextId = 1;
const mk = (from: Msg["from"], text?: string, widget?: Widget): Msg => ({
  id: nextId++,
  from,
  ...(text !== undefined ? { text } : {}),
  ...(widget !== undefined ? { widget } : {}),
});

function Contencion() {
  const { place, setPlace } = usePlace();
  const [step, setStep] = useState<Step>("lugar");
  const [level, setLevel] = useState<Level>("verde");
  const [msgs, setMsgs] = useState<Msg[]>(() => PROMPTS.lugar.map((t) => mk("pam", t)));
  const [draft, setDraft] = useState("");
  const [record, setRecord] = useState<SharedRecord>(emptyRecord);
  const [building, setBuilding] = useState(false);
  const note = (k: SectionKey, item: string) => setRecord((r) => ({ ...r, [k]: addUnique(r[k], item) }));
  const noteResources = () =>
    setRecord((r) => ({
      ...r,
      resources: findResources(place).resources.reduce((l, x) => addUnique(l, `${x.name}: ${x.phone}`), r.resources),
    }));
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, step]);

  const go = (next: Step, before: Msg[] = []) => {
    setMsgs((m) => [...m, ...before, ...PROMPTS[next].map((t) => mk("pam", t))]);
    setStep(next);
  };

  const goRed = (before: Msg[] = []) => {
    setLevel("rojo");
    go("rojo", before);
  };

  const restart = () => {
    setLevel("verde");
    setDraft("");
    setRecord(emptyRecord());
    setBuilding(false);
    setMsgs(PROMPTS.lugar.map((t) => mk("pam", t)));
    setStep("lugar");
  };

  const raiseCaution = () => setLevel((l) => (l === "rojo" ? l : "amarillo"));

  const choose = (label: string, after: () => void) => {
    setMsgs((m) => [...m, mk("yo", label)]);
    after();
  };

  const sendFree = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const mine = mk("yo", text);
    if (detectRedFlags(text)) {
      goRed([mine]);
      return;
    }
    if (step === "escucha" || step === "sentir") note("feelings", text);
    if (step === "escucha") {
      go("sentir", [
        mine,
        mk("pam", "Gracias por confiarme esto. Lo que sientes importa, y no tienes que tenerlo todo resuelto ahora."),
      ]);
    } else if (step === "sentir") {
      go("seguridad", [mine, mk("pam", "Gracias por ponerle palabras. Te leo con atención.")]);
    } else {
      setMsgs((m) => [...m, mine, mk("pam", "Te leo. Gracias por contármelo. Cuando quieras, elige una opción para seguir.")]);
    }
  };

  const confirmPlace = (p: Place) => {
    setPlace(p);
    const label = placeLabel(p);
    go("escucha", [
      mk("yo", label ? `Estoy en ${label}` : "Prefiero no decirlo"),
      mk(
        "pam",
        label
          ? "Gracias. Ya tengo a la mano apoyos verificados para ese lugar, por si los necesitas."
          : "Está bien. Si en algún momento hay peligro, el 911 siempre está a la vista.",
      ),
    ]);
  };

  const options: ReactNode = (() => {
    switch (step) {
      case "lugar":
        return <PlaceForm onConfirm={confirmPlace} />;
      case "escucha":
        return (
          <Chips>
            <Chip onClick={() => choose("Prefiero no contar ahora", () => go("sentir", [mk("pam", "Está bien. Respeto tu tiempo. Aquí sigo.")]))}>
              Prefiero no contar ahora
            </Chip>
          </Chips>
        );
      case "sentir":
        return (
          <Chips>
            {FEELINGS.map((f) => (
              <Chip key={f.label} onClick={() => choose(f.label, () => { note("feelings", f.label); go("seguridad", [mk("pam", f.reply)]); })}>
                {f.label}
              </Chip>
            ))}
          </Chips>
        );
      case "seguridad":
        return (
          <Chips>
            <Chip onClick={() => choose("No, estoy a salvo", () => go("urgencia", [mk("pam", "Qué bueno. Gracias por decírmelo.")]))}>
              No, estoy a salvo
            </Chip>
            <Chip
              onClick={() =>
                choose("No estoy segura o seguro", () => {
                  raiseCaution();
                  go("urgencia", [
                    mk("pam", "Gracias por tu honestidad. Si en algún momento sientes que podrías hacerte daño, llama al 911 o a la Línea de la Vida 800 911 2000."),
                    mk("pam", undefined, "amarillo"),
                  ]);
                })
              }
            >
              No estoy segura o seguro
            </Chip>
            <Chip danger onClick={() => choose("Sí", () => goRed())}>
              Sí
            </Chip>
          </Chips>
        );
      case "urgencia":
        return (
          <Chips>
            <Chip onClick={() => choose("No", () => go("necesidades"))}>No</Chip>
            <Chip danger onClick={() => choose("Sí, hay una urgencia", () => goRed())}>
              Sí, hay una urgencia
            </Chip>
          </Chips>
        );
      case "necesidades":
        return (
          <Chips>
            {NEEDS.map((n) => (
              <Chip
                key={n.label}
                onClick={() =>
                  choose(n.label, () => {
                    if (n.caution) raiseCaution();
                    if (n.label !== "Estoy bien en eso") note("needs", n.label);
                    go("respirar", [mk("pam", n.reply)]);
                  })
                }
              >
                {n.label}
              </Chip>
            ))}
          </Chips>
        );
      case "respirar":
        return (
          <div className="space-y-3">
            <Breathing
              onDone={() =>
                choose("Ya respiré", () => { note("helped", "Respirar despacio, acompañada o acompañado"); go("conectar", [mk("pam", "Lo hiciste muy bien. Cada respiración cuenta.")]); })
              }
            />
            <Chips>
              <Chip onClick={() => choose("Ahora no", () => go("conectar", [mk("pam", "Está bien. Puedes volver a respirar cuando quieras.")]))}>
                Ahora no
              </Chip>
            </Chips>
          </div>
        );
      case "conectar":
        return (
          <Chips>
            <Chip
              onClick={() =>
                choose("Sí, hay alguien", () => {
                  note("helped", "Pensar en una persona de confianza a quien escribir o llamar");
                  noteResources();
                  go("cierre", [
                    mk("pam", "¿Qué tal si le escribes ahora? Puedes copiar este mensaje:"),
                    mk("pam", undefined, "mensaje"),
                    mk("pam", "Y si quieres hablar con un profesional, aquí tienes apoyos verificados:"),
                    mk("pam", undefined, "recursos"),
                  ]);
                })
              }
            >
              Sí, hay alguien
            </Chip>
            <Chip
              onClick={() =>
                choose("No tengo a nadie ahora", () => {
                  noteResources();
                  go("cierre", [
                    mk("pam", "No estás sola ni solo en esto. Hay personas capacitadas que pueden escucharte hoy:"),
                    mk("pam", undefined, "recursos"),
                  ]);
                })
              }
            >
              No tengo a nadie ahora
            </Chip>
            <Chip
              onClick={() =>
                choose("Prefiero un profesional", () => {
                  note("helped", "Decidir buscar apoyo profesional");
                  noteResources();
                  go("cierre", [
                    mk("pam", "Es una gran decisión. Estos apoyos están verificados:"),
                    mk("pam", undefined, "recursos"),
                  ]);
                })
              }
            >
              Prefiero un profesional
            </Chip>
          </Chips>
        );
      case "cierre":
        return (
          <Chips>
            <Chip onClick={() => choose("Más tranquila o tranquilo", () => go(level === "rojo" ? "oferta" : "resumen", [mk("pam", "Me alegra mucho. Esa calma también la construiste tú.")]))}>
              Más tranquila o tranquilo
            </Chip>
            <Chip
              onClick={() =>
                choose("Igual", () => {
                  raiseCaution();
                  go("fin", [
                    mk("pam", "Está bien. A veces la calma tarda en llegar. Te recomiendo buscar apoyo profesional pronto."),
                    mk("pam", undefined, "amarillo"),
                    mk("pam", undefined, "recursos"),
                  ]);
                })
              }
            >
              Igual
            </Chip>
            <Chip onClick={() => choose("Peor", () => go("peor"))}>Peor</Chip>
          </Chips>
        );
      case "peor":
        return (
          <Chips>
            <Chip danger onClick={() => choose("Sí", () => goRed())}>
              Sí
            </Chip>
            <Chip
              onClick={() =>
                choose("No", () => {
                  raiseCaution();
                  go("fin", [
                    mk("pam", "Gracias por cuidarte al decírmelo. Hoy es buen día para hablar con un profesional."),
                    mk("pam", undefined, "amarillo"),
                    mk("pam", undefined, "recursos"),
                  ]);
                })
              }
            >
              No
            </Chip>
          </Chips>
        );
      case "resumen":
        if (level === "rojo") return null;
        return building ? (
          <TherapistSummary
            record={record}
            onDone={() => {
              setBuilding(false);
              setRecord(emptyRecord());
              go("oferta", [mk("pam", "Listo. Tu PDF se descargó en tu teléfono. La app no guardó ninguna copia.")]);
            }}
            onCancel={() => {
              setBuilding(false);
              setRecord(emptyRecord());
              choose("Mejor no", () => go("oferta", [mk("pam", "Está bien. No se guardó nada.")]));
            }}
          />
        ) : (
          <Chips>
            <Chip onClick={() => choose("Sí, quiero el resumen", () => { setBuilding(true); setMsgs((m) => [...m, mk("pam", "Aquí está. Revisa y quita lo que no quieras compartir.")]); })}>
              Sí, quiero el resumen
            </Chip>
            <Chip onClick={() => choose("No, gracias", () => { setRecord(emptyRecord()); go("oferta", [mk("pam", "Está bien. No se guardó nada.")]); })}>
              No, gracias
            </Chip>
          </Chips>
        );
      case "oferta":
        return (
          <div className="space-y-3">
            <Button asChild variant="gold" size="xl" className="w-full">
              <Link to="/mi-elemento" search={{ calma: true }}>
                Sí, quiero explorar mi elemento
              </Link>
            </Button>
            <Chips>
              <Chip onClick={() => choose("Ahora no, gracias", () => go("fin", [mk("pam", "Claro. La invitación queda abierta.")]))}>
                Ahora no, gracias
              </Chip>
            </Chips>
          </div>
        );
      case "fin":
        return (
          <div className="space-y-3">
            {level === "amarillo" && (
              <Chips>
                <Chip onClick={() => choose("Respirar otra vez", () => go("respirar"))}>Respirar otra vez</Chip>
              </Chips>
            )}
            <Button variant="soft" size="xl" className="w-full" onClick={restart}>
              <RotateCcw /> Empezar de nuevo
            </Button>
          </div>
        );
      case "rojo":
        return (
          <div className="space-y-3">
            <RedAlert />
            <ResourceList place={place} />
            <Chips>
              <Chip
                onClick={() =>
                  choose("Ya llamé o ya estoy con alguien", () =>
                    setMsgs((m) => [...m, mk("pam", "Gracias por cuidarte. Quédate con esa persona y sigue sus indicaciones. Aquí sigo.")]),
                  )
                }
              >
                Ya llamé o ya estoy con alguien
              </Chip>
            </Chips>
            <Button variant="ghost" className="w-full" onClick={restart}>
              <RotateCcw /> Empezar de nuevo
            </Button>
          </div>
        );
    }
  })();

  const canType = step !== "lugar" && step !== "rojo";

  return (
    <main className="mx-auto max-w-md px-4 pb-48 pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Necesito contención</h1>
          <p className="text-sm text-muted-foreground">
            Chat guiado y simulado, con respuestas preparadas. No es terapia ni una persona en vivo.
          </p>
        </div>
        {step !== "rojo" && (
          <Button variant="danger-outline" size="sm" className="shrink-0 rounded-full" onClick={() => goRed([mk("yo", "Necesito ayuda urgente")])}>
            <LifeBuoy /> Urgente
          </Button>
        )}
      </div>

      <LevelPill level={level} />

      <ol className="mt-3 space-y-2.5" aria-live="polite">
        {msgs.map((m) => (
          <li key={m.id} className={`flex animate-rise ${m.from === "yo" ? "justify-end" : "justify-start"}`}>
            {m.widget ? (
              <div className="w-full">
                {m.widget === "recursos" && <ResourceList place={place} />}
                {m.widget === "mensaje" && (
                  <CopyPhrase text="Hola, no estoy pasando un buen momento. ¿Puedes hablar conmigo un rato?" />
                )}
                {m.widget === "amarillo" && <CautionNote />}
              </div>
            ) : m.from === "pam" ? (
              <div className="flex max-w-[92%] items-end gap-2">
                <Lanita className="size-9" decorative />
                <p className="rounded-3xl rounded-bl-md border border-lavender bg-secondary px-4 py-2.5 text-secondary-foreground">
                  <span className="mb-0.5 block text-xs font-bold text-primary">Pam</span>
                  {m.text}
                </p>
              </div>
            ) : (
              <p className="max-w-[85%] rounded-3xl rounded-br-md bg-bougainvillea px-4 py-2.5 text-primary-foreground">
                {m.text}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4">{options}</div>
      <div ref={endRef} className="scroll-mb-44" />

      {canType && (
        <form
          onSubmit={sendFree}
          className="fixed inset-x-0 bottom-[4.4rem] z-20 border-t border-border bg-background/95 backdrop-blur"
        >
          <div className="mx-auto flex max-w-md gap-2 px-4 py-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escribe aquí, si quieres…"
              aria-label="Escribe tu mensaje"
              className="h-12 rounded-2xl bg-card text-base"
            />
            <Button type="submit" variant="hero" className="h-12 w-12 shrink-0 rounded-2xl" aria-label="Enviar">
              <Send />
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}

function LevelPill({ level }: { level: Level }) {
  const map = {
    verde: { dot: "bg-safe", box: "bg-safe-soft", text: "Verde: acompañamos con PAP" },
    amarillo: { dot: "bg-caution", box: "bg-caution-soft", text: "Amarillo: busca apoyo profesional pronto" },
    rojo: { dot: "bg-danger", box: "bg-danger-soft", text: "Rojo: peligro, pide ayuda ahora" },
  } as const;
  const v = map[level];
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${v.box}`}>
      <span className={`size-3 rounded-full ${v.dot}`} aria-hidden />
      Semáforo · {v.text}
    </p>
  );
}

function CautionNote() {
  return (
    <div className="rounded-2xl border border-caution/60 bg-caution-soft p-4 text-caution-foreground">
      <p className="font-bold">Semáforo amarillo</p>
      <p className="text-sm">
        Busca apoyo profesional pronto. Si aparece riesgo de hacerte daño, llama al 911 o a la Línea de la Vida
        800 911 2000.
      </p>
    </div>
  );
}

function Chips({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}

function Chip({ children, onClick, danger }: { children: ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <Button variant={danger ? "danger-outline" : "chip"} size="chip" onClick={onClick}>
      {children}
    </Button>
  );
}

function PlaceForm({ onConfirm }: { onConfirm: (p: Place) => void }) {
  const [p, setP] = useState<Place>(DEFAULT_PLACE);
  return (
    <form
      className="space-y-2 rounded-3xl border border-lavender bg-card p-4 shadow-soft"
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm({ city: p.city.trim(), state: p.state.trim(), country: p.country.trim() });
      }}
    >
      {(
        [
          ["city", "Ciudad"],
          ["state", "Estado"],
          ["country", "País"],
        ] as const
      ).map(([k, label]) => (
        <label key={k} className="block">
          <span className="text-sm font-semibold text-secondary-foreground">{label}</span>
          <Input
            value={p[k]}
            onChange={(e) => setP({ ...p, [k]: e.target.value })}
            className="mt-1 h-12 rounded-xl bg-background text-base"
          />
        </label>
      ))}
      <Button type="submit" variant="hero" size="xl" className="mt-2 w-full">
        Usar este lugar
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => onConfirm({ city: "", state: "", country: "" })}
      >
        Prefiero no decirlo
      </Button>
    </form>
  );
}

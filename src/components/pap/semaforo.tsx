import { AlertTriangle, Phone } from "lucide-react";
import { ALARM_SIGNS, type Level } from "@/lib/triage";

const levels: { level: Level; title: string; text: string; dot: string; box: string }[] = [
  {
    level: "verde",
    title: "Verde",
    text: "Se puede acompañar con PAP: mirar, escuchar y conectar.",
    dot: "bg-safe",
    box: "bg-safe-soft border-safe/30",
  },
  {
    level: "amarillo",
    title: "Amarillo",
    text: "Buscar apoyo profesional pronto. El malestar sigue, crece o se repite.",
    dot: "bg-caution",
    box: "bg-caution-soft border-caution/50",
  },
  {
    level: "rojo",
    title: "Rojo",
    text: "Peligro inmediato. Llamar al 911 o a la Línea de la Vida 800 911 2000, quedarse con alguien y acudir a urgencias.",
    dot: "bg-danger",
    box: "bg-danger-soft border-danger/30",
  },
];

export function Semaforo({ current }: { current?: Level }) {
  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {levels.map((l) => (
          <li
            key={l.level}
            className={`flex gap-3 rounded-2xl border p-3 ${l.box} ${current === l.level ? "ring-2 ring-foreground/30" : ""}`}
          >
            <span className={`mt-1 size-5 shrink-0 rounded-full ${l.dot}`} aria-hidden />
            <div>
              <p className="font-bold">{l.title}</p>
              <p className="text-sm">{l.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-2 flex items-center gap-2 font-bold">
          <AlertTriangle className="size-5 text-danger" />
          Señales de alarma (rojo)
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {ALARM_SIGNS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Información educativa. Ante la duda, trata la situación como rojo.
        </p>
      </div>
    </div>
  );
}

export function RedAlert({ who = "tú" }: { who?: "tú" | "la persona" }) {
  return (
    <div
      role="alert"
      className="animate-rise rounded-3xl border-4 border-danger bg-danger-soft p-5 text-center"
    >
      <p className="text-sm font-bold uppercase tracking-widest text-danger">Semáforo rojo</p>
      <h2 className="mt-1 text-3xl font-bold text-danger">Pide ayuda ahora</h2>
      <p className="mt-2">
        {who === "tú"
          ? "Esto necesita ayuda humana inmediata. Esta guía ya no es suficiente por sí sola."
          : "La persona necesita ayuda humana inmediata. No sigas solo con PAP."}
      </p>
      <div className="mt-4 space-y-2">
        <a
          href="tel:911"
          className="flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-danger text-2xl font-bold text-danger-foreground shadow-sm"
        >
          <Phone className="size-6" /> Llamar al 911
        </a>
        <a
          href="tel:8009112000"
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-danger bg-card px-3 text-base font-bold text-danger"
        >
          <Phone className="size-5 shrink-0" /> Línea de la Vida · 800 911 2000
        </a>
      </div>
      <ul className="mt-4 space-y-1 text-left">
        <li>• {who === "tú" ? "Busca a alguien y quédate con esa persona." : "Quédate con la persona, no la dejes sola."}</li>
        <li>• Aléjate de objetos o sustancias con las que puedas lastimarte.</li>
        <li>• Si puedes, acude a urgencias del hospital más cercano.</li>
      </ul>
    </div>
  );
}

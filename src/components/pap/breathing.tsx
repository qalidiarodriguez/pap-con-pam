import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/** Respiración guiada: 4 segundos inhalar, 4 segundos exhalar. */
export function Breathing({ onDone }: { onDone?: () => void }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setPhase((p) => {
        if (p === "out") setCycles((c) => c + 1);
        return p === "in" ? "out" : "in";
      });
    }, 4000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="flex flex-col items-center rounded-3xl bg-lavender-wash p-5 text-center">
      <div className="relative grid size-44 place-items-center">
        <div
          className={`absolute inset-0 rounded-full bg-card/70 shadow-soft ${running ? "animate-breathe" : "scale-[0.62]"}`}
        />
        <div
          className={`absolute inset-6 rounded-full bg-bougainvillea opacity-80 ${running ? "animate-breathe" : "scale-[0.62]"}`}
        />
        <p className="relative font-display text-xl font-semibold text-primary-foreground">
          {running ? (phase === "in" ? "Inhala…" : "Exhala…") : "Listo"}
        </p>
      </div>
      <p className="mt-3 text-secondary-foreground">
        {running
          ? "Inhala por la nariz contando 4. Suelta el aire despacio contando 4."
          : "Cuando quieras, empezamos. Puedes parar en cualquier momento."}
      </p>
      {cycles > 0 && (
        <p className="mt-1 text-sm text-muted-foreground">
          {cycles} {cycles === 1 ? "respiración" : "respiraciones"} completas
        </p>
      )}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button
          variant={running ? "soft" : "hero"}
          size="xl"
          onClick={() => {
            setRunning((r) => !r);
            setPhase("in");
          }}
        >
          {running ? <Pause /> : <Play />}
          {running ? "Pausar" : "Respirar juntos"}
        </Button>
        {onDone && cycles > 0 && (
          <Button variant="gold" size="xl" onClick={onDone}>
            Ya me siento listo(a)
          </Button>
        )}
      </div>
    </div>
  );
}

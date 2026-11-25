import { useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SECTION_TITLES, SUMMARY_DISCLAIMER, downloadSummaryPdf,
  type SectionKey, type SharedRecord,
} from "@/lib/therapist-summary";

export function TherapistSummary({ record, onDone, onCancel }: { record: SharedRecord; onDone: () => void; onCancel: () => void }) {
  const [sel, setSel] = useState<SharedRecord>(() => ({ ...record }));
  const [name, setName] = useState("");
  const [withDate, setWithDate] = useState(false);
  const [busy, setBusy] = useState(false);
  const keys = Object.keys(SECTION_TITLES) as SectionKey[];
  const remove = (k: SectionKey, item: string) => setSel((s) => ({ ...s, [k]: s[k].filter((i) => i !== item) }));
  const total = keys.reduce((n, k) => n + sel[k].length, 0);

  const make = async () => {
    setBusy(true);
    try {
      await downloadSummaryPdf({
        ...(name.trim() ? { name } : {}),
        ...(withDate ? { dateText: new Date().toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" }) } : {}),
        sections: sel,
      });
      onDone();
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card/80 p-4">
      <div>
        <h2 className="text-lg font-semibold">Tu resumen</h2>
        <p className="mt-1 text-sm text-muted-foreground">{SUMMARY_DISCLAIMER}</p>
        <p className="mt-2 text-sm text-muted-foreground">Quita lo que no quieras compartir. El PDF se descarga en tu teléfono; la app no lo guarda ni lo envía a nadie.</p>
      </div>
      {keys.map((k) => (
        <div key={k}>
          <h3 className="text-sm font-semibold">{SECTION_TITLES[k]}</h3>
          {sel[k].length === 0 ? (
            <p className="text-sm text-muted-foreground">Nada incluido.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {sel[k].map((i) => (
                <li key={i} className="flex items-start justify-between gap-3 rounded-xl bg-background/70 px-3 py-2 text-sm">
                  <span>{i}</span>
                  <button type="button" onClick={() => remove(k, i)} aria-label={`Quitar ${i}`} className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground">
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <label className="block text-sm">
        <span className="font-semibold">Tu nombre (opcional)</span>
        <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Solo si quieres" />
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" className="size-5 accent-primary" checked={withDate} onChange={(e) => setWithDate(e.target.checked)} />
        Incluir la fecha y hora de hoy
      </label>
      <div className="space-y-3">
        <Button size="xl" className="w-full" disabled={busy || total === 0} onClick={make}>
          <Download /> Descargar PDF
        </Button>
        <Button variant="ghost" className="w-full" onClick={onCancel}>Mejor no, gracias</Button>
      </div>
    </div>
  );
}

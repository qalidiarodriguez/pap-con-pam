/** Resumen para terapeuta: solo lo que la persona contó. Se genera en el teléfono y no se guarda. */
export interface SharedRecord {
  feelings: string[];
  needs: string[];
  helped: string[];
  resources: string[];
}

export type SectionKey = keyof SharedRecord;

export const SECTION_TITLES: Record<SectionKey, string> = {
  feelings: "Cómo me sentía",
  needs: "Qué necesitaba",
  helped: "Qué me ayudó",
  resources: "Recursos que se me sugirieron",
};

export const SUMMARY_DISCLAIMER =
  "Este documento es solo un resumen de lo que yo conté en la app PAP de Pam, con Lanita (Primeros Auxilios Psicológicos). No es un diagnóstico, no dice qué tengo y no recomienda ningún tratamiento.";

export const emptyRecord = (): SharedRecord => ({ feelings: [], needs: [], helped: [], resources: [] });

export function addUnique(list: string[], item: string): string[] {
  const t = item.trim();
  return t === "" || list.includes(t) ? list : [...list, t];
}

export interface SummaryOptions {
  name?: string;
  dateText?: string;
  sections: Partial<SharedRecord>;
}

/** Construye las líneas del PDF; solo incluye lo elegido. */
export function buildSummaryLines(o: SummaryOptions): { heading?: string; text: string }[] {
  const out: { heading?: string; text: string }[] = [];
  if (o.name && o.name.trim()) out.push({ text: `Nombre: ${o.name.trim()}` });
  if (o.dateText) out.push({ text: `Fecha y hora: ${o.dateText}` });
  (Object.keys(SECTION_TITLES) as SectionKey[]).forEach((k) => {
    const items = o.sections[k];
    if (items && items.length) {
      out.push({ heading: SECTION_TITLES[k], text: items.map((i) => `• ${i}`).join("\n") });
    }
  });
  return out;
}

export async function downloadSummaryPdf(o: SummaryOptions) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 18, maxW = W - M * 2;
  let y = 22;
  const ensure = (h: number) => { if (y + h > 280) { doc.addPage(); y = 20; } };
  doc.setFont("helvetica", "bold"); doc.setFontSize(17);
  doc.text("Resumen para mi terapeuta", M, y); y += 8;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(90);
  const disc = doc.splitTextToSize(SUMMARY_DISCLAIMER, maxW);
  doc.text(disc, M, y); y += disc.length * 4.6 + 6;
  doc.setTextColor(30);
  for (const l of buildSummaryLines(o)) {
    if (l.heading) {
      ensure(12); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
      doc.text(l.heading, M, y); y += 6;
    }
    doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    const lines = doc.splitTextToSize(l.text, maxW);
    ensure(lines.length * 5.2);
    doc.text(lines, M, y); y += lines.length * 5.2 + 4;
  }
  ensure(16); y += 4; doc.setFontSize(9); doc.setTextColor(110);
  doc.text(doc.splitTextToSize("Prototipo educativo. No diagnostica, no medica, no da terapia. Emergencia: 911. Línea de la Vida: 800 911 2000.", maxW), M, y);
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "resumen-para-mi-terapeuta.pdf";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

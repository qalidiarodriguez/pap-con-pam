import { describe, expect, it } from "vitest";
import { addUnique, buildSummaryLines, SUMMARY_DISCLAIMER } from "@/lib/therapist-summary";

describe("resumen para terapeuta", () => {
  it("solo incluye las secciones que la persona dejó", () => {
    const lines = buildSummaryLines({ sections: { feelings: ["Triste"], needs: [], helped: [], resources: [] } });
    expect(lines).toHaveLength(1);
    expect(lines[0]?.heading).toBe("Cómo me sentía");
  });
  it("no pone nombre ni fecha si no se dan", () => {
    const lines = buildSummaryLines({ sections: { feelings: ["Triste"] } });
    expect(lines.some((l) => l.text.startsWith("Nombre") || l.text.startsWith("Fecha"))).toBe(false);
  });
  it("pone nombre y fecha cuando la persona los escribe", () => {
    const lines = buildSummaryLines({ name: "Ana", dateText: "hoy", sections: {} });
    expect(lines.map((l) => l.text)).toEqual(["Nombre: Ana", "Fecha y hora: hoy"]);
  });
  it("aclara que no es diagnóstico ni tratamiento", () => {
    expect(SUMMARY_DISCLAIMER).toMatch(/No es un diagnóstico/);
    expect(SUMMARY_DISCLAIMER).toMatch(/no recomienda ningún tratamiento/);
  });
  it("no repite elementos", () => {
    expect(addUnique(["Triste"], "Triste")).toEqual(["Triste"]);
  });
});

import { describe, expect, it } from "vitest";
import { findResources, SIN_INTERNET, VERIFIED_RESOURCES } from "@/lib/resources";
import { detectRedFlags } from "@/lib/triage";

const ids = (city: string, state: string, country: string) =>
  findResources({ city, state, country }).resources.map((r) => r.id);

describe("Recursos verificados por lugar", () => {
  it("Mérida, Yucatán, México muestra los 5 recursos verificados", () => {
    expect(ids("Mérida", "Yucatán", "México")).toEqual([
      "911",
      "linea-vida",
      "linea-amiga",
      "almanova",
      "cisame",
    ]);
    expect(findResources({ city: "merida", state: "yucatan", country: "mexico" }).needsVerification).toBe(false);
  });

  it("Otra ciudad de Yucatán muestra 911, Línea de la Vida y Línea Amiga", () => {
    expect(ids("Progreso", "Yucatán", "México")).toEqual(["911", "linea-vida", "linea-amiga"]);
  });

  it("Otro estado de México muestra solo los recursos nacionales y marca lo demás por verificar", () => {
    expect(ids("Monterrey", "Nuevo León", "México")).toEqual(["911", "linea-vida"]);
    expect(findResources({ city: "Monterrey", state: "Nuevo León", country: "México" }).needsVerification).toBe(true);
  });

  it("Fuera de México no muestra teléfonos mexicanos", () => {
    expect(ids("Mérida", "Mérida", "Venezuela")).toEqual([]);
    expect(ids("Madrid", "Madrid", "España")).toEqual([]);
  });
});

describe("Señales de alarma", () => {
  it("detecta riesgo de hacerse daño", () => {
    expect(detectRedFlags("Ya no quiero vivir")).toBe(true);
    expect(detectRedFlags("pienso en hacerme daño")).toBe(true);
  });
  it("no marca rojo un malestar sin señales de alarma", () => {
    expect(detectRedFlags("Estoy muy cansada y triste")).toBe(false);
  });
});

describe("Semáforo de cada recurso", () => {
  const levels = (id: string) => VERIFIED_RESOURCES.find((r) => r.id === id)?.guidance?.levels;
  it("911 solo en rojo", () => expect(levels("911")).toEqual(["rojo"]));
  it("Línea de la Vida en rojo y amarillo", () => expect(levels("linea-vida")).toEqual(["rojo", "amarillo"]));
  it("Línea Amiga, AlmaNova y CISAME en amarillo y verde", () => {
    expect(levels("linea-amiga")).toEqual(["amarillo", "verde"]);
    expect(levels("almanova")).toEqual(["amarillo", "verde"]);
    expect(levels("cisame")).toEqual(["amarillo", "verde"]);
  });
  it("Instagram de Pam es solo para verde o amarillo, nunca rojo", () => {
    expect(SIN_INTERNET.instagram.levels).not.toContain("rojo");
  });
  it("WhatsApp de Pam es +52 999 410 3943", () => {
    expect(SIN_INTERNET.whatsapp.url).toBe("https://wa.me/529994103943");
  });
});

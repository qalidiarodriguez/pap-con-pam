import { normalize } from "./resources";

export type Level = "verde" | "amarillo" | "rojo";

/** Frases que indican posible peligro inmediato (señales de alarma educativas). */
const RED_PATTERNS = [
  "suicid",
  "matarme",
  "me quiero morir",
  "quiero morir",
  "quiero morirme",
  "no quiero vivir",
  "ya no quiero estar",
  "quitarme la vida",
  "hacerme dano",
  "lastimarme",
  "cortarme",
  "me corte",
  "tome pastillas",
  "tomar pastillas",
  "sobredosis",
  "ahorcarme",
  "colgarme",
  "aventarme",
  "tirarme de",
  "tengo un plan",
  "despedirme de todos",
  "lo intente",
  "me va a matar",
  "me quiere matar",
  "me esta golpeando",
  "me golpeo",
  "matar a",
  "hacerle dano",
  "no puedo respirar",
  "dolor en el pecho",
  "me duele el pecho",
  "sangrando",
  "escucho voces",
  "me persiguen",
];

export function detectRedFlags(text: string): boolean {
  const t = normalize(text);
  if (t === "") return false;
  return RED_PATTERNS.some((p) => t.includes(p));
}

export const ALARM_SIGNS = [
  "Riesgo de hacerse daño o de quitarse la vida",
  "Tiene un plan o ya hubo un intento",
  "No puede cuidarse: no come, no duerme, no se mueve por días",
  "Pierde contacto con la realidad: voces, confusión intensa",
  "Agresión grave hacia sí o hacia otras personas",
  "Urgencia médica: dolor de pecho, desmayo, intoxicación, sangrado",
];

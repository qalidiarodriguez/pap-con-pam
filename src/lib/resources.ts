export type Scope = "nacional" | "estatal" | "municipal";

export type GuidanceLevel = "rojo" | "amarillo" | "verde";

export interface ResourceGuidance {
  /** En qué semáforo pedir esta ayuda */
  levels: GuidanceLevel[];
  /** Qué ayuda ofrece, en texto corto y calmado */
  help: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  phone: string;
  /** Valor para el enlace tel: (solo dígitos, coma para extensión) */
  tel: string;
  hours: string;
  address?: string;
  scope: Scope;
  place: string;
  emergency?: boolean;
  guidance?: ResourceGuidance;
}

export interface Place {
  city: string;
  state: string;
  country: string;
}

export const DEFAULT_PLACE: Place = { city: "Mérida", state: "Yucatán", country: "México" };

/** Únicamente datos verificados. No agregar otros sin verificación. */
export const VERIFIED_RESOURCES: Resource[] = [
  {
    id: "911",
    name: "Emergencias 911",
    description: "Peligro inmediato, urgencia médica o violencia.",
    phone: "911",
    tel: "911",
    hours: "24 horas",
    scope: "nacional",
    place: "México",
    emergency: true,
    guidance: {
      levels: ["rojo"],
      help: "Emergencia ahora mismo. Si tú o alguien está en peligro, llama al 911. Te atienden 24 horas y mandan la ayuda que se necesita.",
    },
  },
  {
    id: "linea-vida",
    name: "Línea de la Vida (CONASAMA)",
    description: "Atención en crisis emocional, riesgo suicida y adicciones.",
    phone: "800 911 2000",
    tel: "8009112000",
    hours: "24 horas",
    scope: "nacional",
    place: "México",
    emergency: true,
    guidance: {
      levels: ["rojo", "amarillo"],
      help: "Te escuchan 24 horas, todos los días. Llama si sientes que ya no puedes más, si piensas en hacerte daño o si necesitas orientación ahora. No tienes que saber qué decir, puedes empezar con “necesito ayuda”.",
    },
  },
  {
    id: "linea-amiga",
    name: "Línea Amiga Yucatán",
    description: "Escucha y orientación emocional. Gratuita y confidencial.",
    phone: "800 108 8000",
    tel: "8001088000",
    hours: "24 horas",
    scope: "estatal",
    place: "Yucatán, México",
    guidance: {
      levels: ["amarillo", "verde"],
      help: "Escucha y contención gratuita y confidencial, 24 horas. Llama cuando te sientas triste, con ansiedad o sola, y quieras hablar con alguien que te escuche sin juzgar. Tú decides cuánto contar.",
    },
  },
  {
    id: "almanova",
    name: "Centro Municipal AlmaNova Mérida",
    description: "Atención psicológica municipal.",
    phone: "999 942 0000 ext. 86900",
    tel: "9999420000,86900",
    hours: "Lunes a viernes, 13:00 a 20:00",
    address:
      "Calle 58 por 21 Diagonal y Av. Alfredo Barrera, Residencial Pensiones V Etapa, Mérida",
    scope: "municipal",
    place: "Mérida, Yucatán, México",
    guidance: {
      levels: ["amarillo", "verde"],
      help: "Atención psicológica municipal presencial. Para cuando quieres empezar o seguir un acompañamiento, no para una emergencia en el momento. Lunes a viernes, 13:00 a 20:00. Calle 58 por 21 Diagonal y Av. Alfredo Barrera, Residencial Pensiones V Etapa, Mérida. Tel. (999) 942-00-00 ext. 86900.",
    },
  },
  {
    id: "cisame",
    name: "CISAME Mérida",
    description: "Centro Integral de Salud Mental.",
    phone: "999 945 9970",
    tel: "9999459970",
    hours: "Lunes a viernes, 7:00 a 14:00",
    address: "Calle 116 número 341, Yucalpetén, Mérida",
    scope: "municipal",
    place: "Mérida, Yucatán, México",
    guidance: {
      levels: ["amarillo", "verde"],
      help: "Centro Integral de Salud Mental. Atención en salud mental para seguimiento y orientación. Lunes a viernes, 7:00 a 14:00. Calle 116, núm. 341, fraccionamiento Yucalpetén, Mérida. Tel. (999) 945 9970.",
    },
  },
];

/** Canales sin internet que dio Pam (Instagram y WhatsApp). Datos exactos, no cambiar. */
export const SIN_INTERNET = {
  instagram: {
    handle: "@pam.stem",
    url: "https://aistudio.instagram.com/ai/3757472707888101?utm_source=ai_agent",
    levels: ["verde", "amarillo"] as GuidanceLevel[],
  },
  whatsapp: {
    display: "+52 999 410 3943",
    url: "https://wa.me/529994103943",
  },
} as const;

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function matches(value: string, ...targets: string[]): boolean {
  const v = normalize(value);
  return targets.some((t) => v === t || v.includes(t));
}

export interface LookupResult {
  resources: Resource[];
  /** true cuando el lugar no tiene recursos verificados en esta app */
  needsVerification: boolean;
}

export function findResources(place: Place): LookupResult {
  const country = normalize(place.country);
  const state = normalize(place.state);
  const city = normalize(place.city);

  const countryOk = country === "" || matches(country, "mexico", "mx", "estados unidos mexicanos");
  const stateIsYucatan = matches(state, "yucatan");
  const stateOk = state === "" || stateIsYucatan;
  const cityIsMerida = matches(city, "merida");

  const isMexico =
    country !== "" ? countryOk : stateIsYucatan || (cityIsMerida && stateOk && state !== "");
  const isYucatan = countryOk && (stateIsYucatan || (state === "" && cityIsMerida && isMexico));
  const isMerida = countryOk && stateOk && cityIsMerida && (isMexico || isYucatan);

  const resources = VERIFIED_RESOURCES.filter((r) => {
    if (r.scope === "nacional") return isMexico || isYucatan || isMerida;
    if (r.scope === "estatal") return isYucatan || isMerida;
    return isMerida;
  });

  return { resources, needsVerification: resources.length === 0 || !isMerida };
}

export function placeLabel(place: Place): string {
  return [place.city, place.state, place.country].filter((p) => p.trim() !== "").join(", ");
}

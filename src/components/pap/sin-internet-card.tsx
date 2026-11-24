import { AlertTriangle, ExternalLink, Instagram, MessageCircle, Phone, WifiOff } from "lucide-react";
import { SIN_INTERNET } from "@/lib/resources";
import { SemaforoChips } from "./resources-list";

export function SinInternetCard() {
  const { instagram, whatsapp } = SIN_INTERNET;
  return (
    <section className="rounded-3xl border border-mint/40 bg-card p-5 shadow-soft backdrop-blur-sm" aria-labelledby="sin-internet">
      <h2 id="sin-internet" className="flex items-center gap-2 text-xl font-semibold">
        <WifiOff className="size-5 text-mint" /> ¿Sin internet?
      </h2>
      <p className="mt-2">
        Si no tienes internet para usar esta app, también puedes pedir ayuda por Instagram y
        WhatsApp, si tu plan de teléfono los incluye.
      </p>

      <div className="mt-4 rounded-2xl border border-primary/25 bg-instagram-soft p-4">
        <p className="flex items-center gap-2 font-bold">
          <Instagram className="size-5 text-primary" /> En Instagram {instagram.handle}
        </p>
        <p className="mt-1">
          Tienes una IA de PAP que te puede acompañar y también puede hacer imágenes.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-secondary-foreground">Solo para:</span>
          <SemaforoChips levels={instagram.levels} />
        </div>
        <p className="mt-2 text-sm">
          Es solo para semáforo verde o amarillo. Tu conversación ahí es privada.
        </p>
        <a
          href={instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-instagram px-4 text-lg font-bold text-primary-foreground shadow-soft"
        >
          Abrir IA de PAP en Instagram <ExternalLink className="size-5" />
        </a>
        <div className="mt-3 rounded-xl border-2 border-danger/40 bg-danger-soft p-3 text-sm">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
            <span>
              Si estás en semáforo rojo, no esperes por Instagram: llama al{" "}
              <a href="tel:911" className="font-bold text-danger underline">
                911
              </a>{" "}
              o a la Línea de la Vida{" "}
              <a href="tel:8009112000" className="font-bold text-danger underline">
                800 911 2000
              </a>
              .
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-leaf/30 bg-leaf-soft p-4">
        <p className="flex items-center gap-2 font-bold">
          <MessageCircle className="size-5 text-leaf" /> En WhatsApp {whatsapp.display}
        </p>
        <p className="mt-1">Para quien quiere una guía para aplicar los PAP a otra persona.</p>
        <p className="mt-2 rounded-xl border border-caution bg-caution-soft p-3 text-sm text-caution-foreground">
          <strong>Ojo:</strong> este WhatsApp es un sistema de IA automatizado y no es privado. No
          escribas ahí datos personales ni conversaciones privadas. Es solo una guía para ayudar a
          otro, no es atención directa en crisis ni terapia.
        </p>
        <a
          href={whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-mint bg-mint px-4 text-lg font-bold text-primary-foreground"
        >
          <Phone className="size-5" /> Abrir WhatsApp
        </a>
      </div>
    </section>
  );
}

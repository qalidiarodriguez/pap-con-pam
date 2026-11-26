import { Heart } from "lucide-react";

/** Enlace de PayPal aprobado por Pam. No se cambia ni se inventa otro. */
export const DONATE_URL = "https://www.paypal.com/donate/?hosted_button_id=YFPB83RWWYJJN";
export const DONATE_LABEL = "Dona aquí para mejorar esta IA";
export const DONATE_NOTE =
  "Tu donación ayuda a que PAP de Pam con Lanita siga acompañando gratis a quien se siente solo en crisis.";

export function DonateCard() {
  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <a
        href={DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary-soft px-5 py-3 text-center text-lg font-semibold text-primary transition-transform active:scale-[0.99]"
        aria-label={`${DONATE_LABEL} (abre PayPal en una pestaña nueva)`}
      >
        <Heart className="size-5 shrink-0" aria-hidden />
        {DONATE_LABEL}
      </a>
      <p className="mt-3 text-center text-sm leading-snug text-muted-foreground">{DONATE_NOTE}</p>
    </section>
  );
}

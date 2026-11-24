import { Link } from "@tanstack/react-router";
import { BookOpen, HandHeart, Heart, Home, MapPin, Sparkles, Sprout } from "lucide-react";
import type { ReactNode } from "react";
import { Lanita } from "./lanita";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2" aria-label="Ir al inicio">
          <Lanita className="size-10 shadow-soft" decorative />
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-display text-[1.05rem] font-semibold">
              PAP de Pam, <span className="text-primary">con Lanita</span>
            </span>
            <span className="block text-xs text-muted-foreground">Primeros Auxilios Psicológicos</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Más secciones">
          <Link
            to="/que-son-pap"
            className="flex flex-col items-center rounded-xl px-2 py-1 text-[0.7rem] text-secondary-foreground hover:bg-secondary"
            activeProps={{ className: "bg-secondary" }}
          >
            <BookOpen className="size-5" />
            PAP
          </Link>
          <Link
            to="/prompts"
            className="flex flex-col items-center rounded-xl px-2 py-1 text-[0.7rem] text-secondary-foreground hover:bg-secondary"
            activeProps={{ className: "bg-secondary" }}
          >
            <Sparkles className="size-5" />
            Prompts
          </Link>
        </nav>
      </div>
      <div className="h-1 bg-garden" aria-hidden />
      <LimitBanner />
    </header>
  );
}

export function LimitBanner() {
  return (
    <div className="border-t border-gold/40 bg-gold-soft">
      <p className="mx-auto max-w-md px-4 py-1.5 text-center text-[0.8rem] leading-snug text-gold-foreground">
        Prototipo educativo. <strong>No diagnostica, no medica, no da terapia.</strong> Emergencia:{" "}
        <a href="tel:911" className="font-bold underline underline-offset-2">
          911
        </a>
      </p>
    </div>
  );
}

const tabs = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/contencion", label: "Contención", icon: Heart },
  { to: "/ayudar", label: "Ayudar", icon: HandHeart },
  { to: "/cuidadores", label: "Yo cuido", icon: Sprout },
  { to: "/recursos", label: "Recursos", icon: MapPin },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Espacios principales"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 px-1 pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs text-muted-foreground transition-colors"
              activeProps={{ className: "bg-primary-soft font-semibold text-primary" }}
            >
              <Icon className={`size-6 ${to === "/cuidadores" ? "text-leaf" : ""}`} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-md px-4 pb-28 pt-5">{children}</main>;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <div className="mb-5 animate-rise">
      {eyebrow && (
        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-semibold">{title}</h1>
      {intro && <div className="mt-2 text-muted-foreground">{intro}</div>}
    </div>
  );
}

export function Section({
  title,
  icon,
  children,
  tone = "card",
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  tone?: "card" | "lavender" | "gold" | "rose";
}) {
  const tones = {
    card: "bg-card border-border",
    lavender: "bg-secondary border-lavender",
    gold: "bg-gold-soft border-gold/40",
    rose: "bg-primary-soft border-primary/25",
  } as const;
  return (
    <section className={`mb-4 rounded-3xl border p-5 shadow-soft ${tones[tone]}`}>
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
        {icon}
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

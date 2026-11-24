import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Flower2, Leaf, HandHeart, Heart, MapPin, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import type { ReactNode } from "react";
import { Lanita } from "@/components/pap/lanita";
import { Page } from "@/components/pap/shell";
import { SinInternetCard } from "@/components/pap/sin-internet-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PAP de Pam, con Lanita — Primeros Auxilios Psicológicos" },
      {
        name: "description",
        content:
          "Contención, guía para ayudar a otros y autocuidado para cuidadores. Mirar, Escuchar, Conectar.",
      },
      { property: "og:title", content: "PAP de Pam, con Lanita — Primeros Auxilios Psicológicos" },
      {
        property: "og:description",
        content: "Aprende y aplica Primeros Auxilios Psicológicos con calma: Mirar, Escuchar, Conectar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const spaces = [
  {
    to: "/contencion",
    n: "1",
    title: "Necesito contención",
    text: "Para quien está en crisis y no tiene a nadie disponible ahora.",
    icon: Heart,
    card: "bg-bougainvillea text-primary-foreground shadow-rose",
    badge: "bg-card/25",
  },
  {
    to: "/ayudar",
    n: "2",
    title: "Quiero ayudar a alguien",
    text: "Para quien no sabe cómo asistir a una persona en crisis.",
    icon: HandHeart,
    card: "bg-lavender-wash text-secondary-foreground shadow-soft",
    badge: "bg-card/60",
  },
  {
    to: "/cuidadores",
    n: "3",
    title: "Yo cuido a otros",
    text: "Para quienes cuidan constantemente: claridad, límites y autocuidado.",
    icon: Sprout,
    card: "bg-gold-wash text-gold-foreground shadow-soft",
    badge: "bg-card/60 text-leaf",
  },
] as const;

function Index() {
  return (
    <Page>
      <div className="-mx-4 -mt-5 mb-5 bg-dawn px-5 pb-6 pt-7">
        <div className="mb-4 flex items-end gap-3">
          <Lanita className="size-28 shadow-soft" />
          <span className="mb-2 flex items-center gap-1 text-leaf" aria-hidden>
            <Sprout className="size-5" />
            <Leaf className="size-4 -rotate-12" />
            <Flower2 className="size-4 text-lavender-deep" />
          </span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Hola, aquí estoy</p>
        <h1 className="mt-1 text-[2.1rem] font-semibold leading-tight">
          Respira. Vamos paso a paso.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Primeros Auxilios Psicológicos en tres pasos:{" "}
          <strong className="text-foreground">Mirar, Escuchar, Conectar.</strong> Sin registro, sin
          nombre.
        </p>
      </div>

      <h2 className="sr-only">Elige un espacio</h2>
      <ul className="space-y-4">
        {spaces.map(({ to, n, title, text, icon: Icon, card, badge }, i) => (
          <li key={to} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <Link
              to={to}
              className={`flex min-h-32 items-center gap-4 rounded-3xl p-5 transition-transform active:scale-[0.99] ${card}`}
            >
              <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${badge}`}>
                <Icon className="size-7" />
              </span>
              <span className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-widest opacity-80">
                  Espacio {n}
                </span>
                <span className="block font-display text-2xl font-semibold leading-tight">{title}</span>
                <span className="mt-1 block leading-snug opacity-90">{text}</span>
              </span>
              <ChevronRight className="size-6 shrink-0 opacity-70" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-7 grid grid-cols-3 gap-3">
        <MiniLink to="/que-son-pap" icon={<BookOpen className="size-6" />} label="Qué son los PAP" />
        <MiniLink to="/recursos" icon={<MapPin className="size-6" />} label="Recursos cerca de mí" />
        <MiniLink to="/prompts" icon={<Sparkles className="size-6" />} label="Prompts para tu IA" />
      </div>

      <div className="mt-6">
        <SinInternetCard />
      </div>

      <section className="mt-6 rounded-3xl border border-sky/30 bg-sky-soft/80 p-5 text-sky backdrop-blur-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck className="size-5" /> Propósito y límite
        </h2>
        <p className="mt-2">
          Esta app enseña y aplica Primeros Auxilios Psicológicos.{" "}
          <strong>No diagnostica, no medica y no da terapia.</strong> Eso solo lo hacen
          profesionales humanos.
        </p>
        <p className="mt-2 text-sm">
          Es un prototipo educativo, no un servicio de emergencias. Si hay peligro inmediato, llama
          al{" "}
          <a href="tel:911" className="font-bold underline">
            911
          </a>{" "}
          o a la Línea de la Vida{" "}
          <a href="tel:8009112000" className="font-bold underline">
            800 911 2000
          </a>
          .
        </p>
      </section>
    </Page>
  );
}

function MiniLink({
  to,
  icon,
  label,
}: {
  to: "/que-son-pap" | "/recursos" | "/prompts";
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-3 text-center text-sm font-semibold text-secondary-foreground shadow-soft"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Link>
  );
}

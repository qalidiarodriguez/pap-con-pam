import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Ear, Eye, Link2, XCircle } from "lucide-react";
import { Page, PageHeader, Section } from "@/components/pap/shell";

export const Route = createFileRoute("/que-son-pap")({
  head: () => ({
    meta: [
      { title: "Qué son los PAP — PAP de Pam, con Lanita" },
      {
        name: "description",
        content: "Los Primeros Auxilios Psicológicos en tres pasos: Mirar, Escuchar, Conectar. Qué son y qué no son.",
      },
      { property: "og:title", content: "Qué son los Primeros Auxilios Psicológicos" },
      { property: "og:description", content: "Mirar, Escuchar, Conectar: apoyo humano, práctico y respetuoso." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QueSonPap,
});

const pillars = [
  { icon: Eye, title: "Mirar", text: "Revisar la seguridad, detectar urgencias y notar quién necesita apoyo y cómo está reaccionando." },
  { icon: Ear, title: "Escuchar", text: "Acercarse con respeto, preguntar qué necesita, escuchar sin presionar y ayudar a recuperar la calma." },
  { icon: Link2, title: "Conectar", text: "Ayudar a cubrir necesidades básicas, dar información clara y conectar con seres queridos y servicios." },
];

function QueSonPap() {
  return (
    <Page>
      <PageHeader
        eyebrow="Aprende"
        title="Qué son los PAP"
        intro="Los Primeros Auxilios Psicológicos son una forma de apoyo humano, práctico y respetuoso para alguien que atraviesa una situación difícil. Los promueve la Organización Mundial de la Salud."
      />
      <ol className="mb-4 space-y-3">
        {pillars.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-bougainvillea text-primary-foreground">
              <Icon className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Paso {i + 1}</p>
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-1">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Section title="Los PAP sí son" tone="lavender">
        <ul className="space-y-1.5">
          {["Acompañar con calma y respeto", "Escuchar sin juzgar", "Ayudar con lo básico y lo urgente", "Conectar con personas y servicios"].map((t) => (
            <li key={t} className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0 text-safe" />{t}</li>
          ))}
        </ul>
      </Section>
      <Section title="Los PAP no son" tone="rose">
        <ul className="space-y-1.5">
          {["Diagnosticar", "Recetar medicamentos", "Dar terapia", "Obligar a alguien a contar lo que vivió"].map((t) => (
            <li key={t} className="flex gap-2"><XCircle className="mt-1 size-4 shrink-0 text-danger" />{t}</li>
          ))}
        </ul>
        <p className="text-sm">Diagnosticar, medicar y dar terapia solo lo hacen profesionales humanos.</p>
      </Section>
      <Link to="/ayudar" className="block rounded-2xl bg-bougainvillea p-4 text-center text-lg font-bold text-primary-foreground shadow-rose">
        Aprender a ayudar paso a paso
      </Link>
    </Page>
  );
}

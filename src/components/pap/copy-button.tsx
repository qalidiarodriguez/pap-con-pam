import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="soft"
      size="sm"
      className="rounded-full px-3"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "¡Copiado!" : label}
    </Button>
  );
}

export function CopyPhrase({ text }: { text: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-3">
      <p className="flex-1">“{text}”</p>
      <CopyButton text={text} />
    </div>
  );
}

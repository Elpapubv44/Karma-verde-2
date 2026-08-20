import { useState } from "react";
import { PaperCard, PaperButton } from "@/components/paper/Paper";
import { responder } from "@/lib/eco-bot";
import { Bot, Send, User, Sparkles } from "lucide-react";

interface Msg {
  de: "bot" | "yo";
  texto: string;
}

export default function EcoChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      de: "bot",
      texto:
        "¡Hola! Soy EcoBot. Preguntame sobre reciclaje, separación de residuos y cuidado del medio ambiente.",
    },
  ]);
  const [input, setInput] = useState("");

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { de: "yo", texto: q }, { de: "bot", texto: responder(q) }]);
    setInput("");
  }

  return (
    <PaperCard className="p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="display text-xl leading-none text-ink">EcoBot Asistente</h2>
          <p className="text-[11px] text-muted-foreground">Consejos de reciclaje escolar</p>
        </div>
      </div>

      <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${m.de === "yo" ? "justify-end" : "justify-start"}`}
          >
            {m.de === "bot" && (
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={
                m.de === "yo"
                  ? "max-w-[85%] rounded-2xl bg-primary px-3.5 py-2.5 text-sm text-primary-foreground shadow-xs"
                  : "max-w-[85%] rounded-2xl bg-muted/80 px-3.5 py-2.5 text-sm text-ink shadow-xs"
              }
            >
              {m.texto}
            </div>
            {m.de === "yo" && (
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-kraft/40 text-ink">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={enviar} className="mt-3.5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="¿Cómo separo el plástico o el cartón?"
          className="min-w-0 flex-1 rounded-2xl border-2 border-dashed border-kraft/50 bg-background px-3.5 py-2 text-sm outline-none transition-colors focus:border-primary"
        />
        <PaperButton type="submit" className="gap-1.5 px-4">
          <span>Enviar</span>
          <Send className="h-3.5 w-3.5" />
        </PaperButton>
      </form>
    </PaperCard>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PaperButton, PaperCard, PaperTape } from "@/components/paper/Paper";
import { responderQuiz, useStore } from "@/lib/store";
import EcoChat from "@/components/chat/EcoChat";
import {
  Package,
  Layers,
  BatteryCharging,
  Sprout,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/_app/alumno/aprende")({
  component: AprendePage,
});

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Plásticos: Layers,
  Papel: Package,
  Celulosa: Package,
  Metales: Package,
  Peligrosos: BatteryCharging,
  Orgánicos: Sprout,
};

function AprendePage() {
  const guias = useStore((s) => s.guias);
  const quizPreguntas = useStore((s) => s.quizPreguntas);
  const quizzesCompletados = useStore((s) => s.quizzesCompletados);
  const user = useStore((s) => s.user);

  const [open, setOpen] = useState<string | null>(guias[0]?.id ?? null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<
    Record<string, { esCorrecta: boolean; explicacion: string; puntos: number }>
  >({});

  const handleSelectOption = (quizId: string, optionIndex: number) => {
    if (quizzesCompletados.includes(quizId) || quizResults[quizId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionIndex }));
    const res = responderQuiz(quizId, optionIndex);
    setQuizResults((prev) => ({ ...prev, [quizId]: res }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl text-ink">Centro de Aprendizaje y Trivia</h1>
        <p className="text-sm text-muted-foreground">
          Conocé cómo clasificar polímeros y respondé las trivias para sumar puntos adicionales.
        </p>
      </div>

      {/* Interactive Eco-Trivia Section */}
      <PaperCard variant="kraft" className="space-y-4 p-5 border-2 border-sun/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-earth">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="display text-2xl text-ink">Eco-Trivia Escolar (+50 pts c/u)</h2>
          </div>
          <span className="rounded-full bg-sun/30 px-3 py-1 text-xs font-black text-ink">
            {quizzesCompletados.length} / {quizPreguntas.length} Completadas
          </span>
        </div>

        <div className="space-y-4">
          {quizPreguntas.map((q, qIndex) => {
            const isCompleted = quizzesCompletados.includes(q.id);
            const result = quizResults[q.id];
            const chosen = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="rounded-2xl border-2 border-dashed border-kraft/60 bg-cream p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-extrabold text-ink text-sm">
                    {qIndex + 1}. {q.pregunta}
                  </p>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-black text-primary">
                    +{q.puntosPremio} pts
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {q.opciones.map((opt, optIndex) => {
                    const isSelected = chosen === optIndex;
                    const isCorrect = q.respuestaCorrecta === optIndex;
                    let style = "bg-card border-kraft/40 hover:bg-kraft/15 text-ink";

                    if (result || isCompleted) {
                      if (isCorrect) {
                        style = "bg-primary/20 border-primary font-bold text-primary";
                      } else if (isSelected && !isCorrect) {
                        style =
                          "bg-destructive/15 border-destructive text-destructive line-through";
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        disabled={!!result || isCompleted}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`flex items-center justify-between rounded-xl border-2 p-2.5 text-left text-xs transition active:scale-98 ${style}`}
                      >
                        <span>{opt}</span>
                        {result && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        )}
                        {result && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {(result || isCompleted) && (
                  <div className="rounded-xl bg-card p-3 text-xs leading-relaxed space-y-1">
                    <p className="font-bold text-primary flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> Explicación Técnica:
                    </p>
                    <p className="text-earth">{q.explicacion}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PaperCard>

      {/* Guías de Separación de Residuos */}
      <div>
        <h2 className="display mb-3 text-2xl text-ink">Guías de Clasificación y Polímeros</h2>
        <div className="space-y-3">
          {guias.map((g, i) => {
            const isOpen = open === g.id;
            const Icon = CATEGORY_ICONS[g.categoria] ?? BookOpen;

            return (
              <PaperCard key={g.id} tilt={i % 2 ? "l" : "r"} className="p-0">
                <button
                  onClick={() => setOpen(isOpen ? null : g.id)}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 text-left"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-cutout)]">
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-ink">{g.titulo}</p>
                    <PaperTape color="kraft" className="mt-1 text-[10px]">
                      {g.categoria}
                    </PaperTape>
                  </div>
                  <span className="text-earth">
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t-2 border-dashed border-kraft/40 px-4 pb-4 pt-3 text-sm text-ink leading-relaxed space-y-2">
                    <p>{g.contenido}</p>
                    <div className="rounded-xl bg-card p-2 text-xs font-bold text-earth">
                      💡 Consejo: Recordá siempre vaciar y compactar antes de depositar en el Punto
                      Verde.
                    </div>
                  </div>
                )}
              </PaperCard>
            );
          })}
        </div>
      </div>

      <EcoChat />
    </div>
  );
}

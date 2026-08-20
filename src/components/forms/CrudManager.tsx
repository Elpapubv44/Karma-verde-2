import { useState, type ReactNode } from "react";
import { PaperButton, PaperCard } from "../paper/Paper";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "url";
  placeholder?: string;
}

interface CrudManagerProps<T extends { id: string }> {
  title: string;
  subtitle?: string;
  items: T[];
  fields: FieldDef[];
  empty: () => Omit<T, "id">;
  onSave: (item: T) => void;
  onDelete: (id: string) => void;
  render: (item: T) => ReactNode;
}

export function CrudManager<T extends { id: string }>({
  title,
  subtitle,
  items,
  fields,
  empty,
  onSave,
  onDelete,
  render,
}: CrudManagerProps<T>) {
  const [draft, setDraft] = useState<Partial<T> | null>(null);

  function startNew() {
    setDraft({ ...(empty() as object), id: "" } as Partial<T>);
  }
  function startEdit(item: T) {
    setDraft({ ...item });
  }
  function save() {
    if (!draft) return;
    const id = (draft.id as string) || crypto.randomUUID();
    onSave({ ...(draft as T), id });
    setDraft(null);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <h1 className="display truncate text-3xl text-ink">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <PaperButton variant="leaf" onClick={startNew} className="shrink-0">
          + Nuevo
        </PaperButton>
      </div>

      {draft && (
        <PaperCard tilt="l" className="space-y-3">
          <h3 className="display text-xl">{(draft.id as string) ? "Editar" : "Crear"}</h3>
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-earth">
                {f.label}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={((draft as Record<string, unknown>)[f.name] as string) ?? ""}
                  onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value } as Partial<T>)}
                  placeholder={f.placeholder}
                  className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-4 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                  value={
                    ((draft as Record<string, unknown>)[f.name] as string | number | undefined) ??
                    ""
                  }
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value,
                    } as Partial<T>)
                  }
                  placeholder={f.placeholder}
                  className="w-full rounded-2xl border-2 border-kraft/60 bg-cream px-4 py-2 text-sm text-ink outline-none focus:border-primary"
                />
              )}
            </label>
          ))}
          <div className="flex gap-2 pt-1">
            <PaperButton variant="leaf" onClick={save}>
              Guardar
            </PaperButton>
            <PaperButton variant="cream" onClick={() => setDraft(null)}>
              Cancelar
            </PaperButton>
          </div>
        </PaperCard>
      )}

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.id}>
            <PaperCard tilt={i % 2 ? "r" : "l"} className="flex flex-col gap-3">
              <div className="min-w-0">{render(item)}</div>
              <div className="flex gap-2 border-t-2 border-dashed border-kraft/40 pt-3">
                <PaperButton variant="kraft" onClick={() => startEdit(item)}>
                  Editar
                </PaperButton>
                <PaperButton
                  variant="cream"
                  className="!border-destructive !text-destructive"
                  onClick={() => onDelete(item.id)}
                >
                  Borrar
                </PaperButton>
              </div>
            </PaperCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

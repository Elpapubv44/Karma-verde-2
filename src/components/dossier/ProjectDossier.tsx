import { useState } from "react";
import { useStore, selectEcoImpacto } from "@/lib/store";
import {
  FileText,
  Printer,
  X,
  ShieldCheck,
  Leaf,
  Scale,
  Gift,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export function DossierModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const user = useStore((s) => s.user);
  const eco = useStore(selectEcoImpacto);
  const metas = useStore((s) => s.metasComunitarias);
  const [activeTab, setActiveTab] = useState<"resumen" | "seguridad" | "formulas" | "roles">(
    "resumen",
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-2 backdrop-blur-sm sm:p-4 print:p-0 print:bg-white">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border-2 border-kraft/60 bg-cream text-ink shadow-2xl print:border-none print:shadow-none print:max-h-none print:w-full">
        {/* Header - No print buttons on paper print */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-kraft/60 px-5 py-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="display text-2xl font-bold text-ink">Dossier Académico y Técnico</h2>
              <p className="text-xs font-bold text-muted-foreground">
                Documentación para Presentación Escolar · Karmaverde 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary bg-primary px-3.5 py-1.5 text-xs font-extrabold text-primary-foreground shadow-xs transition hover:brightness-105 active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Guardar como PDF / Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full border-2 border-kraft/60 text-ink hover:bg-kraft/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation - Hidden in print */}
        <div className="flex border-b border-kraft/40 bg-card/60 px-4 py-2 text-xs font-extrabold uppercase tracking-wider print:hidden">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`rounded-xl px-3 py-1.5 transition ${
              activeTab === "resumen"
                ? "bg-primary text-primary-foreground"
                : "text-earth hover:bg-kraft/20"
            }`}
          >
            1. Resumen Ejecutivo
          </button>
          <button
            onClick={() => setActiveTab("seguridad")}
            className={`rounded-xl px-3 py-1.5 transition ${
              activeTab === "seguridad"
                ? "bg-primary text-primary-foreground"
                : "text-earth hover:bg-kraft/20"
            }`}
          >
            2. Anti-Fraude & Trazabilidad
          </button>
          <button
            onClick={() => setActiveTab("formulas")}
            className={`rounded-xl px-3 py-1.5 transition ${
              activeTab === "formulas"
                ? "bg-primary text-primary-foreground"
                : "text-earth hover:bg-kraft/20"
            }`}
          >
            3. Métricas de Impacto
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`rounded-xl px-3 py-1.5 transition ${
              activeTab === "roles"
                ? "bg-primary text-primary-foreground"
                : "text-earth hover:bg-kraft/20"
            }`}
          >
            4. Matriz de Roles
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed print:overflow-visible print:p-0">
          {/* Printable Cover Header */}
          <div className="border-b-2 border-earth/20 pb-4 text-center">
            <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-black text-primary uppercase tracking-widest mb-2">
              Proyecto de Innovación Ambiental & Economía Circular
            </span>
            <h1 className="display text-3xl font-extrabold text-ink sm:text-4xl">
              Karmaverde: Sistema Integral de Gestión y Recolección de Plásticos Escolares
            </h1>
            <p className="mt-1 text-xs font-bold text-earth">
              Fecha de Presentación: Agosto 2026 · E.E.S.T. N° 3 Roberto Arlt / Red de Escuelas
              Verdes
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Leaf className="h-5 w-5" />
              <h3 className="display text-xl font-bold text-ink">1. Propósito y Diagnóstico</h3>
            </div>
            <p className="text-earth">
              El proyecto <strong>Karmaverde</strong> transforma la gestión de residuos plásticos
              escolares (principalmente <strong>PET y PEAD</strong>) mediante un ecosistema digital
              de incentivos verificados, trazabilidad logística y economía circular real.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-kraft/50 bg-card p-3">
                <p className="font-extrabold text-destructive text-xs uppercase mb-1">
                  ❌ Problemas Previos Detectados
                </p>
                <ul className="list-disc pl-4 text-xs space-y-1 text-earth">
                  <li>Falta de incentivos reales para el reciclaje estudiantil.</li>
                  <li>Riesgo de fraude con QRs no protegidos o puntos duplicados.</li>
                  <li>Falta de comprobación física de peso y limpieza del plástico.</li>
                  <li>Inexistencia de métricas científicas de huella de carbono.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-kraft/50 bg-card p-3">
                <p className="font-extrabold text-primary text-xs uppercase mb-1">
                  ✅ Soluciones Implementadas en Karmaverde
                </p>
                <ul className="list-disc pl-4 text-xs space-y-1 text-earth">
                  <li>Tokenización única con hash criptográfico por escaneo.</li>
                  <li>Doble factor de validación (Escaneo de alumno + Balanza / Referente).</li>
                  <li>Vouchers QR de canje con stock en tiempo real y código único.</li>
                  <li>Metas comunitarias para mejoras en el patio escolar.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="display text-xl font-bold text-ink">
                2. Arquitectura de Seguridad y Anti-Fraude
              </h3>
            </div>
            <div className="rounded-2xl border border-kraft/60 bg-card/80 p-4 space-y-2">
              <p className="text-xs font-bold text-ink">
                Flujo de Validación y Cadena de Custodia:
              </p>
              <div className="flex flex-col gap-2 text-xs text-earth">
                <div className="flex items-start gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white text-[10px] font-black">
                    1
                  </span>
                  <span>
                    <strong>Entrega en Punto Verde:</strong> El alumno ingresa envases limpios,
                    secos y compactados. El sistema genera un hash SHA/Token único.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white text-[10px] font-black">
                    2
                  </span>
                  <span>
                    <strong>Pesaje y Certificación:</strong> La cooperativa o referente docente
                    valida el pesaje en balanza y confirma el remito digital.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white text-[10px] font-black">
                    3
                  </span>
                  <span>
                    <strong>Canje de Premios con Voucher Seguro:</strong> Cada premio genera un
                    código intransferible (ej: <code>KV-TKT-9842A</code>) con caducidad de 30 días.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white text-[10px] font-black">
                    4
                  </span>
                  <span>
                    <strong>Protección de Datos de Menores:</strong> Anonimización automática en
                    rankings públicos (ej. "Sofía M. - 5° Año").
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" />
              <h3 className="display text-xl font-bold text-ink">
                3. Modelo Científico de Impacto Ecológico
              </h3>
            </div>
            <p className="text-xs text-earth">
              Basado en los estándares internacionales de evaluación de ciclo de vida (LCA) para
              reciclado de polímeros posconsumo:
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl border border-kraft/40 bg-card p-3 text-center">
                <p className="text-[10px] font-black uppercase text-earth">Plástico Total</p>
                <p className="display text-2xl text-primary font-bold">{eco.kgTotales} kg</p>
                <p className="text-[10px] text-muted-foreground">Material recuperado</p>
              </div>
              <div className="rounded-2xl border border-kraft/40 bg-card p-3 text-center">
                <p className="text-[10px] font-black uppercase text-earth">Agua Ahorrada</p>
                <p className="display text-2xl text-primary font-bold">
                  {eco.litrosAguaAhorrados} L
                </p>
                <p className="text-[10px] text-muted-foreground">24L / kg reciclado</p>
              </div>
              <div className="rounded-2xl border border-kraft/40 bg-card p-3 text-center">
                <p className="text-[10px] font-black uppercase text-earth">CO₂ Evitado</p>
                <p className="display text-2xl text-primary font-bold">{eco.kgCo2Evitado} kg</p>
                <p className="text-[10px] text-muted-foreground">1.85 kg CO₂ / kg</p>
              </div>
              <div className="rounded-2xl border border-kraft/40 bg-card p-3 text-center">
                <p className="text-[10px] font-black uppercase text-earth">Energía Ahorrada</p>
                <p className="display text-2xl text-primary font-bold">
                  {eco.kwhEnergiaAhorrada} kWh
                </p>
                <p className="text-[10px] text-muted-foreground">5.6 kWh / kg</p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" />
              <h3 className="display text-xl font-bold text-ink">
                4. Matriz de Roles y Responsabilidades
              </h3>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-kraft/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-kraft/20 font-black uppercase text-earth">
                  <tr>
                    <th className="p-2.5">Rol</th>
                    <th className="p-2.5">Funciones Principales</th>
                    <th className="p-2.5">Seguridad y Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-kraft/30">
                  <tr>
                    <td className="p-2.5 font-bold text-primary">1. Alumno</td>
                    <td className="p-2.5">
                      Escaneo de material, mapa de puntos verdes, canje de vouchers, trivias
                      educativas.
                    </td>
                    <td className="p-2.5">Identidad protegida, un solo uso por QR.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-primary">2. Creador / Docente</td>
                    <td className="p-2.5">
                      Carga de contenido pedagógico, administración del catálogo de premios y
                      etapas.
                    </td>
                    <td className="p-2.5">Acceso por código maestro docente.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-primary">3. Asociado / Cooperativa</td>
                    <td className="p-2.5">
                      Logística de retiro, pesaje de fardos en balanza, validación de entrega de
                      premios.
                    </td>
                    <td className="p-2.5">Remitos digitales con registro de pesaje.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-primary">4. Superior / Directivo</td>
                    <td className="p-2.5">
                      Supervisión distrital, auditoría de escuelas, asignación de roles y
                      estadísticas globales.
                    </td>
                    <td className="p-2.5">Gestión de accesos y configuración global.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature & Academic Footer */}
          <div className="mt-8 border-t-2 border-dashed border-kraft/50 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground print:flex">
            <div>
              <p className="font-bold text-ink">Proyecto Karmaverde v2.4</p>
              <p>Desarrollado para el Programa de Escuelas Sustentables</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-ink">Firma de Presentación Académica</p>
              <p>Docente Coordinador / Alumno Expositor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

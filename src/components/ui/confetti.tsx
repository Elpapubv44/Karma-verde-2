import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  shape: "rect" | "circle" | "leaf";
  duration: number;
  delay: number;
}

const COLORS = [
  "oklch(0.55 0.15 148)", // leaf green
  "oklch(0.85 0.14 85)", // sun yellow
  "oklch(0.72 0.08 65)", // kraft tan
  "oklch(0.65 0.18 140)", // mint
  "oklch(0.6 0.12 210)", // sky
  "oklch(0.98 0.02 90)", // cream
];

export function triggerConfetti() {
  window.dispatchEvent(new CustomEvent("trigger-eco-confetti"));
}

export function EcoConfetti() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    function handleTrigger() {
      const count = 40;
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 96 + 2, // 2% to 98%
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 12 + 8,
        shape: Math.random() > 0.6 ? "leaf" : Math.random() > 0.3 ? "rect" : "circle",
        duration: 1.8 + Math.random() * 1.4,
        delay: Math.random() * 0.4,
      }));
      setParticles(newParticles);
      setActive(true);

      const timeout = setTimeout(() => {
        setActive(false);
      }, 3500);

      return () => clearTimeout(timeout);
    }

    window.addEventListener("trigger-eco-confetti", handleTrigger);
    return () => window.removeEventListener("trigger-eco-confetti", handleTrigger);
  }, []);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: p.shape === "rect" ? `${p.size * 1.5}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "leaf" ? "80% 0" : "2px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            animation: `ecoConfettiFall ${p.duration}s ease-in forwards ${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes ecoConfettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

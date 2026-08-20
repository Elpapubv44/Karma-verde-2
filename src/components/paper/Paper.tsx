import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";

type Variant = "leaf" | "kraft" | "cream" | "ghost";
interface PaperButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  leaf: "bg-primary text-primary-foreground",
  kraft: "bg-kraft text-kraft-foreground",
  cream: "bg-cream text-ink border-2 border-kraft",
  ghost: "bg-transparent text-ink border-2 border-dashed border-kraft",
};

export const PaperButton = forwardRef<HTMLButtonElement, PaperButtonProps>(
  ({ variant = "leaf", className = "", children, ...rest }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold shadow-[var(--shadow-cutout)] transition-transform hover:-translate-y-0.5 active-pop ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  ),
);
PaperButton.displayName = "PaperButton";

interface PaperCardProps extends HTMLAttributes<HTMLDivElement> {
  tilt?: "l" | "r" | "none";
  variant?: "cream" | "leaf" | "kraft";
}
export function PaperCard({
  tilt = "none",
  variant = "cream",
  className = "",
  children,
  ...rest
}: PaperCardProps) {
  const tiltClass = tilt === "l" ? "tilt-l" : tilt === "r" ? "tilt-r" : "";
  const variantClass =
    variant === "leaf" ? "paper-card-leaf" : variant === "kraft" ? "paper-card-kraft" : "";
  return (
    <div className={`paper-card p-5 ${variantClass} ${tiltClass} ${className}`} {...rest}>
      {children}
    </div>
  );
}

interface PaperTapeProps {
  children: ReactNode;
  color?: "leaf" | "kraft" | "sun";
  className?: string;
}
export function PaperTape({ children, color = "sun", className = "" }: PaperTapeProps) {
  const colorMap = {
    leaf: "bg-primary text-primary-foreground",
    kraft: "bg-kraft text-kraft-foreground",
    sun: "bg-sun text-ink",
  } as const;
  return (
    <span
      className={`paper-tape inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
}

interface PaperBadgeProps {
  children: ReactNode;
  className?: string;
}
export function PaperBadge({ children, className = "" }: PaperBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-2 border-earth/30 bg-cream px-3 py-1 text-xs font-bold text-ink ${className}`}
    >
      {children}
    </span>
  );
}

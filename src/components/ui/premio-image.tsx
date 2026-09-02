import { useState } from "react";
import { Gift, Package, Sparkles } from "lucide-react";

interface PremioImageProps {
  src?: string;
  alt: string;
  className?: string;
  categoria?: string;
}

export function PremioImage({
  src,
  alt,
  className = "aspect-square w-full object-cover",
  categoria,
}: PremioImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-kraft/20 p-4 text-earth border-2 border-dashed border-kraft/60 rounded-2xl ${className}`}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cream text-primary shadow-xs">
          {categoria === "utiles" ? <Package className="h-6 w-6" /> : <Gift className="h-6 w-6" />}
        </div>
        <span className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-earth/80 line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {!loaded && (
        <div
          className={`absolute inset-0 grid place-items-center bg-kraft/15 animate-pulse ${className}`}
        >
          <Sparkles className="h-5 w-5 text-kraft" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

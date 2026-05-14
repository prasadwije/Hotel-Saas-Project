"use client";
import { useEffect, useState } from "react";
import {
  normalizeHeroImages,
  type HeroImageInput,
  type HeroTransition,
} from "@/components/template/blocks/shared";

type Props = {
  images: HeroImageInput[];
  alt: string;
  transition?: HeroTransition;
  className?: string;
  intervalMs?: number;
  /** Decorative overlay rendered above the per-image dim layer (vignettes, gradients). */
  overlay?: React.ReactNode;
};

/** Per-image dim layer driven by the image's `darkness` (0–100). */
function DimLayer({ darkness, visible = true }: { darkness: number; visible?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-[1200ms] ease-out"
      style={{ opacity: visible ? darkness / 100 : 0 }}
    />
  );
}

/**
 * Auto-playing hero backdrop.
 * - 1 image  → static
 * - 2+ images → 'fade' (cross-fade) or 'slide' (horizontal translate)
 */
export function HeroSlider({
  images,
  alt,
  transition = "fade",
  className = "",
  intervalMs = 5500,
  overlay,
}: Props) {
  const safe = normalizeHeroImages(images);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (safe.length < 2) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % safe.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [safe.length, intervalMs]);

  if (safe.length === 0) {
    return (
      <div className={`absolute inset-0 bg-neutral-200 ${className}`}>
        {overlay}
      </div>
    );
  }

  if (safe.length === 1) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <img
          src={safe[0].url}
          alt={alt}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          loading="eager"
        />
        <DimLayer darkness={safe[0].darkness} />
        {overlay}
      </div>
    );
  }

  if (transition === "slide") {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div
          className="flex h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {safe.map((img, i) => (
            <div key={img.url + i} className="relative h-full w-full shrink-0">
              <img
                src={img.url}
                alt={alt}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <DimLayer darkness={img.darkness} />
            </div>
          ))}
        </div>
        {overlay}
        <SliderDots count={safe.length} active={idx} onSelect={setIdx} />
      </div>
    );
  }

  // fade
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {safe.map((img, i) => (
        <div
          key={img.url + i}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${i === idx ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={img.url}
            alt={alt}
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <DimLayer darkness={img.darkness} visible={i === idx} />
        </div>
      ))}
      {overlay}
      <SliderDots count={safe.length} active={idx} onSelect={setIdx} />
    </div>
  );
}

function SliderDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
        />
      ))}
    </div>
  );
}
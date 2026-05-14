"use client";
import { useState } from "react";

type Props = {
  src?: string;
  fallback?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

const PLACEHOLDER =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Crect width='16' height='10' fill='%23eeeae3'/%3E%3C/svg%3E";

export function MenuItemImage({
  src,
  fallback,
  alt,
  className = "",
  imgClassName = "",
}: Props) {
  const initial = src ?? fallback ?? PLACEHOLDER;
  const [current, setCurrent] = useState(initial);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`site-menu-item-image relative bg-neutral-100 ${className}`}
      aria-hidden={false}
    >
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              "linear-gradient(110deg, #ece9e2 8%, #f5f3ee 18%, #ece9e2 33%)",
            backgroundSize: "200% 100%",
          }}
        />
      )}
      <img
        src={current}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (current !== fallback && fallback) setCurrent(fallback);
          else if (current !== PLACEHOLDER) setCurrent(PLACEHOLDER);
          setLoaded(true);
        }}
        className={`relative h-full w-full object-cover transition-all duration-700 ease-out ${loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
          } ${imgClassName}`}
      />
    </div>
  );
}

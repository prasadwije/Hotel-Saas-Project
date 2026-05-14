"use client";
import { Play } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

export function VideoHighlightV2({ data }: BlockProps) {
  if (!data.videoUrl) return null;
  return (
    <section className="site-video-section site-video-v2 relative overflow-hidden bg-neutral-950 text-white">
      <div className="relative h-[80vh] min-h-[520px] w-full">
        <iframe title={`${data.businessName} highlight`} src={data.videoUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl backdrop-blur" style={{ color: "var(--site-primary)" }}>
            <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
          </span>
          <p className="mt-8 text-[10px] uppercase tracking-[0.4em] text-white/70">Highlight</p>
          <h2 className="hotel-title mt-4 text-balance text-4xl font-light leading-tight md:text-6xl" style={{ fontFamily: SERIF }}>Step inside {data.businessName}</h2>
        </div>
      </div>
    </section>
  );
}

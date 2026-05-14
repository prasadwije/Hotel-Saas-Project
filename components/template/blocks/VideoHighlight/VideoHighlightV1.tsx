"use client";
import { Play } from "lucide-react";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader } from "@/components/template/blocks/shared";

export function VideoHighlightV1({ data }: BlockProps) {
  if (!data.videoUrl) return null;
  return (
    <section className="site-video-section site-video-v1 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader eyebrow="Highlight" title="Step inside" rule={false} />
        <div className="site-video-frame group relative aspect-video overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl ring-1 ring-black/10">
          <iframe title={`${data.businessName} highlight`} src={data.videoUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-90 transition-opacity duration-500 group-hover:opacity-0">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-2xl backdrop-blur" style={{ color: "var(--site-primary)" }}>
              <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF } from "@/components/template/blocks/shared";

export function AboutV2({ data }: BlockProps) {
  return (
    <section id="about" className="site-about-section site-about-v2 mx-auto max-w-3xl px-6 py-28 text-center md:py-40">
      <p className="mb-5 text-xs uppercase tracking-[0.4em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
      <h2 className="hotel-title text-balance text-4xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-6xl" style={{ fontFamily: SERIF }}>
        Crafted with care, served with grace.
      </h2>
      <div className="mx-auto my-10 h-px w-16" style={{ backgroundColor: "var(--site-primary)" }} />
      <p className="site-about-text mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600 md:text-xl" style={{ fontFamily: SERIF }}>
        {data.aboutText}
      </p>
      <p className="mt-10 text-xs uppercase tracking-[0.35em] text-neutral-400">— The {data.businessName} Family</p>
    </section>
  );
}

import type { BlockProps } from "@/components/template/blocks/shared";
import { SERIF, firstHeroImage, isPageEnabled, useIsDedicatedPage } from "@/components/template/blocks/shared";
import { ReadMoreCTA } from "@/components/template/ReadMoreCTA";

export function AboutV1({ data }: BlockProps) {
  const onDedicated = useIsDedicatedPage("about");
  const truncate = isPageEnabled(data, "about") && !onDedicated;
  const fullText = onDedicated && data.aboutFullStory?.trim() ? data.aboutFullStory : data.aboutText;
  const shortText = data.aboutShortSummary?.trim()
    ? data.aboutShortSummary
    : fullText.length > 240
      ? fullText.slice(0, 240).trimEnd() + "…"
      : fullText;
  const bodyText = truncate ? shortText : fullText;
  return (
    <section id="about" className="site-about-section site-about-v1 mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <div className="site-about-copy order-2 md:order-1">
          <p className="mb-4 text-xs uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Our Story</p>
          <h2 className="hotel-title text-4xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-5xl" style={{ fontFamily: SERIF }}>
            Crafted with care, served with grace.
          </h2>
          <p className="site-about-text mt-8 text-base leading-relaxed text-neutral-600 md:text-lg">{bodyText}</p>
          <div className="mt-6">
            <ReadMoreCTA data={data} sectionKey="about" label="Read our full story" />
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div>
              <p className="text-3xl font-light" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>20+</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Years of Craft</p>
            </div>
            <div className="h-10 w-px bg-neutral-200" />
            <div>
              <p className="text-3xl font-light" style={{ fontFamily: SERIF, color: "var(--site-primary)" }}>★★★★★</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Guest Reviews</p>
            </div>
          </div>
        </div>
        <div className="site-about-visual relative order-1 md:order-2">
          <div className="absolute -inset-4 -z-10 rounded-3xl md:-inset-6" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--site-primary) 18%, transparent), transparent)" }} />
          <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
            <img src={data.galleryImages?.[0] ?? firstHeroImage(data) ?? ""} alt={`${data.businessName} interior`} className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-neutral-200/70 bg-white/80 px-5 py-4 shadow-xl backdrop-blur-xl md:block">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Est.</p>
            <p className="text-2xl font-light text-neutral-900" style={{ fontFamily: SERIF }}>MMIV</p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader, SERIF } from "@/components/template/blocks/shared";

// V2 — two-column grid of Q&A
export function FaqV2({ data }: BlockProps) {
  if (!data.faqs?.length) return null;
  return (
    <section id="faq" className="site-faq-section site-faq-v2 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="FAQ" title="Questions, answered" rule={false} />
        <div className="site-faq-grid grid gap-x-12 gap-y-10 md:grid-cols-2">
          {data.faqs.map((faq, i) => (
            <div key={faq.question + i} className="site-faq-item border-t border-neutral-200 pt-6">
              <p className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--site-primary)" }}>Q · {String(i + 1).padStart(2, "0")}</p>
              <h3 className="hotel-title site-faq-question mt-3 text-2xl font-light leading-snug text-neutral-900" style={{ fontFamily: SERIF }}>{faq.question}</h3>
              <p className="site-faq-answer mt-4 text-sm leading-relaxed text-neutral-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

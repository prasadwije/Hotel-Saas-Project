"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { BlockProps } from "@/components/template/blocks/shared";
import { SectionHeader } from "@/components/template/blocks/shared";

export function FaqV1({ data }: BlockProps) {
  if (!data.faqs?.length) return null;
  return (
    <section id="faq" className="site-faq-section site-faq-v1 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader eyebrow="FAQ" title="Questions, answered" rule={false} />
        <Accordion type="single" collapsible className="site-faq-list rounded-3xl border border-neutral-200 bg-white px-2 shadow-sm">
          {data.faqs.map((faq, i) => (
            <AccordionItem key={faq.question + i} value={`faq-${i}`} className="site-faq-item border-b border-neutral-100 last:border-b-0">
              <AccordionTrigger className="site-faq-question px-5 py-5 text-left text-base font-medium tracking-tight text-neutral-900 hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="site-faq-answer px-5 pb-6 text-sm leading-relaxed text-neutral-600">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

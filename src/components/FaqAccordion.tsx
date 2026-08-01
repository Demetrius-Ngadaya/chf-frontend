"use client";

import { useState } from "react";

type Faq = {
  id: number;
  category: string | null;
  question: string;
  answer: string;
};

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="divide-y divide-ink/10 border-t border-ink/10">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div key={faq.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-body text-base font-semibold text-ink">
                {faq.question}
              </span>
              <span className="shrink-0 font-mono text-xl text-clay">
                {isOpen ? "\u2212" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="pb-5 font-body text-sm leading-relaxed text-ink/70">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

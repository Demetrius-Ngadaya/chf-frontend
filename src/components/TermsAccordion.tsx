"use client";

import { useState } from "react";

type Term = {
  id: number;
  title: string;
  description: string;
};

export default function TermsAccordion({ terms }: { terms: Term[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="divide-y divide-ink/10 border-t border-ink/10">
      {terms.map((term) => {
        const isOpen = openId === term.id;

        return (
          <div key={term.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : term.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-body text-base font-semibold text-ink">
                {term.title}
              </span>
              <span className="shrink-0 font-mono text-xl text-clay">
                {isOpen ? "\u2212" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="pb-5 font-body text-sm leading-relaxed text-ink/70">
                {term.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

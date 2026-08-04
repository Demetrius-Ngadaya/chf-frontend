"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Partner = {
  id: number;
  name: string;
  category: string | null;
  description: string;
  website: string | null;
  country: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  projects_together: string | null;
  start_date: string | null;
  end_date: string | null;
  logo_path: string | null;
};

function logoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export default function PartnerGrid({ partners }: { partners: Partner[] }) {
  const [selected, setSelected] = useState<Partner | null>(null);

  return (
    <>
      <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <button
            key={partner.id}
            onClick={() => setSelected(partner)}
            className="flex flex-col items-center border-t-2 border-baobab pt-6 text-center transition-transform hover:-translate-y-1"
          >
            {partner.logo_path ? (
              <img
                src={logoUrl(partner.logo_path)}
                alt={partner.name}
                className="h-28 w-28 rounded-full bg-white object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-baobab/10 font-display text-3xl text-baobab">
                {partner.name.charAt(0)}
              </div>
            )}
            {partner.category && (
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-clay">
                {partner.category}
              </p>
            )}
            <h3 className="mt-1 font-display text-xl text-ink">
              {partner.name}
            </h3>
            <p className="mt-3 line-clamp-3 font-body text-sm text-ink/70">
              {partner.description}
            </p>
            {partner.country && (
              <p className="mt-3 font-mono text-xs text-ink/40">
                {partner.country}
              </p>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-baobab-dark shadow-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sand hover:bg-white/20"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              <div className="flex flex-col items-center px-8 pb-8 pt-12">
                {selected.logo_path ? (
                  <motion.img
                    src={logoUrl(selected.logo_path)}
                    alt={selected.name}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
                    className="h-40 w-40 rounded-full bg-white object-cover shadow-xl ring-4 ring-white/10"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10 font-display text-5xl text-sand">
                    {selected.name.charAt(0)}
                  </div>
                )}

                <h2 className="mt-6 text-center font-display text-2xl text-sand">
                  {selected.name}
                </h2>
                {selected.category && (
                  <p className="mt-1 text-center font-mono text-xs uppercase tracking-[0.15em] text-gold">
                    {selected.category}
                  </p>
                )}

                <p className="mt-6 text-center font-body text-sm leading-relaxed text-sand/80">
                  {selected.description}
                </p>

                {selected.projects_together && (
                  <div className="mt-6 w-full max-w-sm border-t border-white/10 pt-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40">
                      Projects Together
                    </p>
                    <p className="mt-1 whitespace-pre-line font-body text-sm text-sand/70">
                      {selected.projects_together}
                    </p>
                  </div>
                )}

                <dl className="mt-6 grid w-full max-w-sm grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
                  {selected.address && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40">
                        Address
                      </dt>
                      <dd className="mt-1 font-body text-sm text-sand/80">
                        {selected.address}
                      </dd>
                    </div>
                  )}
                  {(selected.start_date || selected.end_date) && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40">
                        Partnership
                      </dt>
                      <dd className="mt-1 font-body text-sm text-sand/80">
                        {selected.start_date ?? "?"} - {selected.end_date ?? "present"}
                      </dd>
                    </div>
                  )}
                  {selected.country && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40">
                        Country
                      </dt>
                      <dd className="mt-1 font-body text-sm text-sand/80">
                        {selected.country}
                      </dd>
                    </div>
                  )}
                  {selected.contact_person && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40">
                        Contact
                      </dt>
                      <dd className="mt-1 font-body text-sm text-sand/80">
                        {selected.contact_person}
                      </dd>
                    </div>
                  )}
                  {selected.email && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40">
                        Email
                      </dt>
                      <dd className="mt-1 font-body text-sm">
                        <a
                          href={`mailto:${selected.email}`}
                          className="text-gold underline"
                      >
                        {selected.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {selected.phone && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40">
                        Phone
                      </dt>
                      <dd className="mt-1 font-body text-sm">
                        <a
                          href={`tel:${selected.phone}`}
                          className="text-gold underline"
                      >
                        {selected.phone}
                      </a>
                      </dd>
                    </div>
                  )}
                </dl>

                {selected.website && (
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 rounded-full bg-clay px-6 py-2 font-body text-sm font-semibold text-sand transition-transform hover:scale-105"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

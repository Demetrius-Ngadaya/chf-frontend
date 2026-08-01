"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Member = {
  id: number;
  full_name: string;
  position: string;
  bio: string;
  qualifications: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  photo_path: string | null;
};

function photoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

function SocialIcons({ member, size = "sm" }: { member: Member; size?: "sm" | "lg" }) {
  const iconClass =
    size === "lg"
      ? "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sand transition-colors hover:bg-white/20"
      : "flex h-8 w-8 items-center justify-center rounded-full bg-baobab/10 text-baobab transition-colors hover:bg-baobab/20";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {member.phone && (
        <a
          href={`tel:${member.phone}`}
          onClick={(e) => e.stopPropagation()}
          className={iconClass}
          title="Call"
          aria-label="Call"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
          </svg>
        </a>
      )}
      {member.phone && (
        <a
          href={waLink(member.phone)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={iconClass}
          title="WhatsApp"
          aria-label="WhatsApp"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3C8.6 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.1l-.3-.2-3 .8.8-2.9-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.3-1.2-3.2-2.8-.2-.4.2-.4.6-1.3.1-.1.1-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
          </svg>
        </a>
      )}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          onClick={(e) => e.stopPropagation()}
          className={iconClass}
          title="Email"
          aria-label="Email"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13zm2.2.5 7.3 5.3a1 1 0 0 0 1 0L19.8 6H4.2zM4 8.1V18.5c0 .3.2.5.5.5h15a.5.5 0 0 0 .5-.5V8.1l-7.1 5.1a3 3 0 0 1-3.8 0L4 8.1z" />
          </svg>
        </a>
      )}
      {member.linkedin_url && (
        <a
          href={member.linkedin_url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={iconClass}
          title="LinkedIn"
          aria-label="LinkedIn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.4 3H3.6A.6.6 0 0 0 3 3.6v16.8a.6.6 0 0 0 .6.6h16.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6zM8.3 18.1H5.7V9.9h2.6v8.2zM7 8.8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11.1 9.3h-2.6v-4c0-1-.4-1.6-1.2-1.6-.7 0-1.1.5-1.3 1-.1.2-.1.5-.1.7v3.9h-2.6s.1-7.4 0-8.2h2.6v1.2c.3-.5 1-1.3 2.4-1.3 1.7 0 3 1.1 3 3.6v4.7z" />
          </svg>
        </a>
      )}
      {member.facebook_url && (
        <a
          href={member.facebook_url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={iconClass}
          title="Facebook"
          aria-label="Facebook"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
          </svg>
        </a>
      )}
      {member.twitter_url && (
        <a
          href={member.twitter_url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={iconClass}
          title="Twitter / X"
          aria-label="Twitter / X"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.9 3H22l-7.2 8.2L23 21h-6.6l-5.2-6.8L5.2 21H2l7.7-8.8L1.5 3h6.7l4.7 6.2L18.9 3zm-1.2 16h1.7L7.4 5H5.6l12.1 14z" />
          </svg>
        </a>
      )}
      {member.instagram_url && (
        <a
          href={member.instagram_url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={iconClass}
          title="Instagram"
          aria-label="Instagram"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c-2.7 0-3.1 0-4.1.1-1.1 0-1.8.2-2.4.5-.7.2-1.2.6-1.8 1.1-.5.6-.9 1.1-1.1 1.8-.3.6-.5 1.3-.5 2.4C2 8.9 2 9.3 2 12s0 3.1.1 4.1c0 1.1.2 1.8.5 2.4.2.7.6 1.2 1.1 1.8.6.5 1.1.9 1.8 1.1.6.3 1.3.5 2.4.5C8.9 22 9.3 22 12 22s3.1 0 4.1-.1c1.1 0 1.8-.2 2.4-.5.7-.2 1.2-.6 1.8-1.1.5-.6.9-1.1 1.1-1.8.3-.6.5-1.3.5-2.4.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c0-1.1-.2-1.8-.5-2.4-.2-.7-.6-1.2-1.1-1.8-.6-.5-1.1-.9-1.8-1.1-.6-.3-1.3-.5-2.4-.5C15.1 2 14.7 2 12 2zm0 1.8c2.6 0 3 0 4 .1.9 0 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.5.6.7 1.1.2.3.3.9.3 1.8.1 1 .1 1.4.1 4s0 3-.1 4c0 .9-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.5-1.1.7-.3.2-.9.3-1.8.3-1 .1-1.4.1-4 .1s-3 0-4-.1c-.9 0-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.5-.6-.7-1.1-.2-.3-.3-.9-.3-1.8-.1-1-.1-1.4-.1-4s0-3 .1-4c0-.9.2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.5 1.1-.7.3-.2.9-.3 1.8-.3 1-.1 1.4-.1 4-.1zm0 3.5a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default function TeamGrid({ members }: { members: Member[] }) {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <>
      <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => setSelected(member)}
            className="flex flex-col items-center border-t-2 border-baobab pt-6 text-center transition-transform hover:-translate-y-1"
          >
            {member.photo_path ? (
              <img
                src={photoUrl(member.photo_path)}
                alt={member.full_name}
                className="h-28 w-28 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-baobab/10 font-display text-3xl text-baobab">
                {member.full_name.charAt(0)}
              </div>
            )}
            <h3 className="mt-4 font-display text-xl text-ink">
              {member.full_name}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-clay">
              {member.position}
            </p>
            <p className="mt-3 line-clamp-3 font-body text-sm text-ink/70">
              {member.bio}
            </p>
            <div className="mt-4">
              <SocialIcons member={member} />
            </div>
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
                {selected.photo_path ? (
                  <motion.img
                    src={photoUrl(selected.photo_path)}
                    alt={selected.full_name}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
                    className="h-40 w-40 rounded-full object-cover shadow-xl ring-4 ring-white/10"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10 font-display text-5xl text-sand">
                    {selected.full_name.charAt(0)}
                  </div>
                )}

                <h2 className="mt-6 text-center font-display text-2xl text-sand">
                  {selected.full_name}
                </h2>
                <p className="mt-1 text-center font-mono text-xs uppercase tracking-[0.15em] text-gold">
                  {selected.position}
                </p>

                <p className="mt-6 text-center font-body text-sm leading-relaxed text-sand/80">
                  {selected.bio}
                </p>

                {selected.qualifications && (
                  <p className="mt-4 max-w-md text-center font-body text-xs text-sand/50">
                    {selected.qualifications}
                  </p>
                )}

                <div className="mt-6">
                  <SocialIcons member={selected} size="lg" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

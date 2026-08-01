"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PROVIDERS = ["Airtel", "Tigo", "Halopesa", "Azampesa", "Mpesa"];

export default function EventRegisterForm({
  eventSlug,
  ticketPrice,
  currency,
}: {
  eventSlug: string;
  ticketPrice: number | null;
  currency: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketsCount, setTicketsCount] = useState(1);
  const [provider, setProvider] = useState("");
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const isFree = !ticketPrice || ticketPrice <= 0;
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!fullName && !phone) return;

    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventSlug}/register/draft`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              registration_id: registrationId,
              full_name: fullName || null,
              email: email || null,
              phone: phone || null,
              tickets_count: ticketsCount,
            }),
          }
        );
        const data = await res.json();
        if (data.registration_id) setRegistrationId(data.registration_id);
      } catch {
        // Silent — background convenience save.
      }
    }, 2000);

    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, email, phone, ticketsCount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setFeedback(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventSlug}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            registration_id: registrationId,
            full_name: fullName,
            email: email || null,
            phone,
            tickets_count: ticketsCount,
            provider: isFree ? null : provider,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
      } else {
        setStatus("error");
        setFeedback(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Could not reach the server. Please try again.");
    }
  }

  function closeAndReset() {
    setOpen(false);
    if (status === "success") {
      setFullName("");
      setEmail("");
      setPhone("");
      setTicketsCount(1);
      setProvider("");
      setRegistrationId(null);
      setStatus("idle");
      setFeedback(null);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-8 rounded-full bg-baobab px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-105"
      >
        Reserve a Spot
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAndReset}
          >
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeAndReset}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink hover:bg-ink/10"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              <div className="p-6">
                {status === "success" ? (
                  <div className="py-4">
                    <p className="font-body text-sm text-baobab">{feedback}</p>
                    <button
                      onClick={closeAndReset}
                      className="mt-5 rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 className="font-body text-sm font-semibold text-ink">
                      Reserve Your Spot
                    </h3>

                    {status === "error" && feedback && (
                      <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
                        {feedback}
                      </p>
                    )}

                    <div className="mt-4">
                      <label className="font-body text-sm text-ink/70">Full Name</label>
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="font-body text-sm text-ink/70">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-sm text-ink/70">Phone</label>
                        <input
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                        />
                      </div>
                      <div>
                        <label className="font-body text-sm text-ink/70">Tickets</label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={ticketsCount}
                          onChange={(e) => setTicketsCount(Number(e.target.value))}
                          className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                        />
                      </div>
                    </div>

                    {!isFree && (
                      <div className="mt-4">
                        <label className="font-body text-sm text-ink/70">
                          Mobile Money Provider
                        </label>
                        <select
                          required
                          value={provider}
                          onChange={(e) => setProvider(e.target.value)}
                          className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                        >
                          <option value="">Select a provider...</option>
                          {PROVIDERS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 font-mono text-xs text-ink/40">
                          Total: {((ticketPrice ?? 0) * ticketsCount).toLocaleString()}{" "}
                          {currency ?? "TZS"}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="mt-5 w-full rounded-full bg-baobab px-6 py-3 font-body text-sm font-semibold text-sand disabled:opacity-50"
                    >
                      {status === "submitting"
                        ? "Submitting..."
                        : isFree
                          ? "Confirm Registration"
                          : "Pay & Reserve"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

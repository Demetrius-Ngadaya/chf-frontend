"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";

type Registration = {
  id: number;
  event_id: number;
  event_name: string | null;
  full_name: string;
  email: string | null;
  phone: string;
  tickets_count: number;
  payment_status: "incomplete" | "pending" | "paid" | "failed";
  created_at: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  incomplete: "bg-ink/10 text-ink/50",
  pending: "bg-gold/20 text-gold",
  paid: "bg-baobab/15 text-baobab",
  failed: "bg-clay/15 text-clay",
};

export default function AdminEventRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await adminFetch<Registration[]>("/event-registrations");
    setRegistrations(data);
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this registration?")) return;
    await adminFetch(`/event-registrations/${id}`, { method: "DELETE" });
    await load();
  }

  if (loading) {
    return (
      <main className="px-6 py-8 md:px-8">
        <p className="font-body text-sm text-ink/60">Loading...</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        Applications
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">
        Event Registrations
      </h1>
      <p className="mt-2 max-w-2xl font-body text-sm text-ink/50">
        Everyone who has started or completed a booking for any event.
        "Incomplete" means they started filling the form but never
        submitted — useful for following up.
      </p>

      <div className="mt-8 max-w-4xl divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {registrations.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No registrations yet.
          </p>
        )}
        {registrations.map((r) => (
          <div key={r.id} className="flex items-start justify-between p-5">
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {r.full_name || "(no name yet)"}{" "}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${STATUS_STYLES[r.payment_status]}`}
                >
                  {r.payment_status}
                </span>
              </p>
              <p className="mt-1 font-body text-sm text-ink/60">
                {r.event_name ?? "Unknown event"}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                {r.phone || "no phone"}
                {r.email ? ` · ${r.email}` : ""} · {r.tickets_count} ticket
                {r.tickets_count === 1 ? "" : "s"}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/30">
                {r.created_at}
              </p>
            </div>
            <button
              onClick={() => handleDelete(r.id)}
              className="shrink-0 font-body text-sm text-clay underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

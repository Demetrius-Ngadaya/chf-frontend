"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe, getToken } from "@/lib/adminApi";

type Event = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string | null;
  venue: string | null;
  start_date: string;
  end_date: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  is_booking_enabled: boolean;
  ticket_price: number | null;
  capacity: number | null;
  organizer: string | null;
  poster_path: string | null;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  venue: "",
  start_date: "",
  end_date: "",
  status: "upcoming",
  is_booking_enabled: false,
  ticket_price: "",
  capacity: "",
  organizer: "",
  poster_path: "",
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadEvents() {
    const data = await adminFetch<Event[]>("/events");
    setEvents(data);
  }

  async function handlePosterUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "events");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setForm((f) => ({ ...f, poster_path: data.path }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    fetchMe().then(async (me) => {
      if (!me) {
        router.push("/admin/login");
        return;
      }
      await loadEvents();
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      ticket_price: form.ticket_price === "" ? null : Number(form.ticket_price),
      capacity: form.capacity === "" ? null : Number(form.capacity),
    };

    try {
      if (editingId) {
        await adminFetch(`/events/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/events", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(event: Event) {
    setEditingId(event.id);
    setForm({
      name: event.name,
      description: event.description,
      category: event.category ?? "",
      venue: event.venue ?? "",
      start_date: event.start_date,
      end_date: event.end_date,
      status: event.status,
      is_booking_enabled: event.is_booking_enabled,
      ticket_price: event.ticket_price?.toString() ?? "",
      capacity: event.capacity?.toString() ?? "",
      organizer: event.organizer ?? "",
      poster_path: event.poster_path ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this event?")) return;
    await adminFetch(`/events/${id}`, { method: "DELETE" });
    await loadEvents();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand">
        <p className="font-body text-sm text-ink/60">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
          CHF Admin
        </p>
        <h1 className="mt-1 font-display text-2xl text-ink">
          Manage Events
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-ink/10 bg-white p-6"
        >
          <h2 className="font-body text-sm font-semibold text-ink">
            {editingId ? "Edit Event" : "Add New Event"}
          </h2>

          {error && (
            <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
              {error}
            </p>
          )}

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Poster</label>
            {form.poster_path && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${form.poster_path}`}
                alt="Preview"
                className="mt-2 h-32 w-24 rounded object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePosterUpload(file);
              }}
              className="mt-2 block font-body text-sm text-ink/70"
            />
            {uploading && (
              <p className="mt-1 font-body text-xs text-ink/50">Uploading...</p>
            )}
          </div>

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">
                Category (optional)
              </label>
              <input
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                Venue (optional)
              </label>
              <input
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">
                Start Date
              </label>
              <input
                required
                type="datetime-local"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                End Date
              </label>
              <input
                required
                type="datetime-local"
                value={form.end_date}
                onChange={(e) =>
                  setForm({ ...form, end_date: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                Organizer (optional)
              </label>
              <input
                value={form.organizer}
                onChange={(e) =>
                  setForm({ ...form, organizer: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 font-body text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.is_booking_enabled}
              onChange={(e) =>
                setForm({ ...form, is_booking_enabled: e.target.checked })
              }
            />
            Enable booking / reservations
          </label>

          {form.is_booking_enabled && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-ink/70">
                  Ticket Price (optional, TZS)
                </label>
                <input
                  type="number"
                  value={form.ticket_price}
                  onChange={(e) =>
                    setForm({ ...form, ticket_price: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>
              <div>
                <label className="font-body text-sm text-ink/70">
                  Capacity (optional)
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Event"
                  : "Add Event"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
                className="rounded-full border border-ink/20 px-5 py-2 font-body text-sm text-ink"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {events.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No events yet. Add your first one above.
            </p>
          )}
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between p-5"
            >
              <div>
                <p className="font-body text-sm font-semibold text-ink">
                  {event.name}
                </p>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {event.start_date} - {event.venue ?? "no venue"}
                </p>
                <p className="mt-1 font-mono text-xs text-ink/40">
                  {event.status}
                  {event.is_booking_enabled ? " - booking enabled" : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => startEdit(event)}
                  className="font-body text-sm text-baobab underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="font-body text-sm text-clay underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Event = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string | null;
  venue: string | null;
  map_lat: number | null;
  map_lng: number | null;
  start_date: string;
  end_date: string;
  registration_deadline: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  is_booking_enabled: boolean;
  ticket_price: number | null;
  capacity: number | null;
  organizer: string | null;
  poster_path: string | null;
  agenda: string | null;
  guest_speakers: string | null;
  sponsors: string | null;
};

type GalleryImage = {
  id: number;
  image_path: string;
  caption: string | null;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  venue: "",
  map_lat: "",
  map_lng: "",
  start_date: "",
  end_date: "",
  registration_deadline: "",
  status: "upcoming",
  is_booking_enabled: false,
  ticket_price: "",
  capacity: "",
  organizer: "",
  poster_path: "",
  agenda: "",
  guest_speakers: "",
  sponsors: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [loading, setLoading] = useState(true);

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);

  async function loadEvents() {
    const data = await adminFetch<Event[]>("/events");
    setEvents(data);
  }

  async function loadGallery(eventId: number) {
    const data = await adminFetch<GalleryImage[]>(`/events/${eventId}/galleries`);
    setGallery(data);
  }

  async function uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Upload failed");
    return data.path;
  }

  async function handlePosterUpload(file: File) {
    setUploadingPoster(true);
    setError(null);
    try {
      const path = await uploadFile(file, "events");
      setForm((f) => ({ ...f, poster_path: path }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPoster(false);
    }
  }

  async function handleGalleryUpload(file: File) {
    if (!editingId) return;
    setUploadingGalleryImage(true);
    setError(null);
    try {
      const path = await uploadFile(file, "events");
      await adminFetch(`/events/${editingId}/galleries`, {
        method: "POST",
        body: JSON.stringify({ image_path: path }),
      });
      await loadGallery(editingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingGalleryImage(false);
    }
  }

  async function handleDeleteGalleryImage(id: number) {
    if (!editingId) return;
    await adminFetch(`/event-galleries/${id}`, { method: "DELETE" });
    await loadGallery(editingId);
  }

  useEffect(() => {
    loadEvents().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      map_lat: form.map_lat === "" ? null : Number(form.map_lat),
      map_lng: form.map_lng === "" ? null : Number(form.map_lng),
      ticket_price: form.ticket_price === "" ? null : Number(form.ticket_price),
      capacity: form.capacity === "" ? null : Number(form.capacity),
      registration_deadline: form.registration_deadline || null,
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
      setGallery([]);
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
      map_lat: event.map_lat?.toString() ?? "",
      map_lng: event.map_lng?.toString() ?? "",
      start_date: event.start_date,
      end_date: event.end_date,
      registration_deadline: event.registration_deadline ?? "",
      status: event.status,
      is_booking_enabled: event.is_booking_enabled,
      ticket_price: event.ticket_price?.toString() ?? "",
      capacity: event.capacity?.toString() ?? "",
      organizer: event.organizer ?? "",
      poster_path: event.poster_path ?? "",
      agenda: event.agenda ?? "",
      guest_speakers: event.guest_speakers ?? "",
      sponsors: event.sponsors ?? "",
    });
    loadGallery(event.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this event?")) return;
    await adminFetch(`/events/${id}`, { method: "DELETE" });
    await loadEvents();
  }

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        CHF Admin
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">Manage Events</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
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
              className="mt-2 h-40 w-full max-w-sm rounded object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            disabled={uploadingPoster}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePosterUpload(file);
            }}
            className="mt-2 block font-body text-sm text-ink/70"
          />
          {uploadingPoster && (
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
          <label className="font-body text-sm text-ink/70">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Venue (optional)
          </label>
          <input
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Map Latitude (optional)
            </label>
            <input
              value={form.map_lat}
              onChange={(e) => setForm({ ...form, map_lat: e.target.value })}
              placeholder="e.g. -6.7924"
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Map Longitude (optional)
            </label>
            <input
              value={form.map_lng}
              onChange={(e) => setForm({ ...form, map_lng: e.target.value })}
              placeholder="e.g. 39.2083"
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>
        <p className="mt-1 font-mono text-xs text-ink/40">
          Tip: right-click the location on Google Maps and copy the
          coordinates shown at the top of the menu.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Start Date &amp; Time
            </label>
            <input
              required
              type="datetime-local"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              End Date &amp; Time
            </label>
            <input
              required
              type="datetime-local"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Registration Deadline (optional)
          </label>
          <input
            type="datetime-local"
            value={form.registration_deadline}
            onChange={(e) =>
              setForm({ ...form, registration_deadline: e.target.value })
            }
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Agenda (optional, one item per line)
          </label>
          <textarea
            rows={3}
            value={form.agenda}
            onChange={(e) => setForm({ ...form, agenda: e.target.value })}
            placeholder={"9:00 - Registration\n10:00 - Opening remarks"}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Guest Speakers (optional, one per line)
          </label>
          <textarea
            rows={2}
            value={form.guest_speakers}
            onChange={(e) => setForm({ ...form, guest_speakers: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Sponsors (optional, one per line)
          </label>
          <textarea
            rows={2}
            value={form.sponsors}
            onChange={(e) => setForm({ ...form, sponsors: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Ticket Price (optional)
            </label>
            <input
              type="number"
              value={form.ticket_price}
              onChange={(e) => setForm({ ...form, ticket_price: e.target.value })}
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
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Organizer (optional)
          </label>
          <input
            value={form.organizer}
            onChange={(e) => setForm({ ...form, organizer: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <label className="mt-4 flex items-center gap-2 font-body text-sm text-ink/70">
          <input
            type="checkbox"
            checked={form.is_booking_enabled}
            onChange={(e) =>
              setForm({ ...form, is_booking_enabled: e.target.checked })
            }
          />
          Booking enabled
        </label>

        {editingId && (
          <div className="mt-6 border-t border-ink/10 pt-6">
            <label className="font-body text-sm text-ink/70">
              Event Gallery ({gallery.length} image
              {gallery.length === 1 ? "" : "s"})
            </label>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${img.image_path}`}
                    alt=""
                    className="h-20 w-full rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteGalleryImage(img.id)}
                    className="absolute right-1 top-1 rounded-full bg-clay px-1.5 py-0.5 font-mono text-[10px] text-sand"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingGalleryImage}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleGalleryUpload(file);
              }}
              className="mt-3 block font-body text-sm text-ink/70"
            />
            {uploadingGalleryImage && (
              <p className="mt-1 font-body text-xs text-ink/50">
                Uploading...
              </p>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Event" : "Add Event"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
                setGallery([]);
              }}
              className="rounded-full border border-ink/20 px-5 py-2 font-body text-sm text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 max-w-3xl divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {events.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No events yet. Add your first one above.
          </p>
        )}
        {events.map((event) => (
          <div key={event.id} className="flex items-start justify-between p-5">
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {event.name}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                {event.status} - {event.venue ?? "no venue"}
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
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe, getToken } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Testimonial = {
  id: number;
  name: string;
  category:
    | "patient"
    | "health_worker"
    | "community_leader"
    | "woman"
    | "youth"
    | "partner";
  story: string;
  location: string | null;
  rating: number | null;
  is_featured: boolean;
  is_published: boolean;
  photo_path: string | null;
};

const EMPTY_FORM = {
  name: "",
  category: "patient",
  story: "",
  location: "",
  rating: "",
  is_featured: false,
  is_published: true,
  photo_path: "",
};

const CATEGORY_LABELS: Record<string, string> = {
  patient: "Patient",
  health_worker: "Health Worker",
  community_leader: "Community Leader",
  woman: "Woman Beneficiary",
  youth: "Youth Beneficiary",
  partner: "Partner",
};

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadTestimonials() {
    const data = await adminFetch<Testimonial[]>("/testimonials");
    setTestimonials(data);
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "testimonials");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setForm((f) => ({ ...f, photo_path: data.path }));
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
      await loadTestimonials();
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      rating: form.rating === "" ? null : Number(form.rating),
    };

    try {
      if (editingId) {
        await adminFetch(`/testimonials/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/testimonials", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadTestimonials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(testimonial: Testimonial) {
    setEditingId(testimonial.id);
    setForm({
      name: testimonial.name,
      category: testimonial.category,
      story: testimonial.story,
      location: testimonial.location ?? "",
      rating: testimonial.rating?.toString() ?? "",
      is_featured: testimonial.is_featured,
      is_published: testimonial.is_published,
      photo_path: testimonial.photo_path ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await adminFetch(`/testimonials/${id}`, { method: "DELETE" });
    await loadTestimonials();
  }

  if (checking) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
          CHF Admin
        </p>
        <h1 className="mt-1 font-display text-2xl text-ink">
          Manage Testimonials
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-ink/10 bg-white p-6"
        >
          <h2 className="font-body text-sm font-semibold text-ink">
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>

          {error && (
            <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
              {error}
            </p>
          )}

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Photo</label>
            {form.photo_path && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${form.photo_path}`}
                alt="Preview"
                className="mt-2 h-20 w-20 rounded-full object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
              className="mt-2 block font-body text-sm text-ink/70"
            />
            {uploading && (
              <p className="mt-1 font-body text-xs text-ink/50">Uploading...</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Story</label>
            <textarea
              required
              rows={4}
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">
                Location (optional)
              </label>
              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                Rating 1-5 (optional)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2 font-body text-sm text-ink/70">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm({ ...form, is_featured: e.target.checked })
                }
              />
              Feature on homepage
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-ink/70">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm({ ...form, is_published: e.target.checked })
                }
              />
              Published
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Testimonial"
                  : "Add Testimonial"}
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
          {testimonials.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No testimonials yet. Add your first one above.
            </p>
          )}
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex items-start justify-between p-5"
            >
              <div>
                <p className="font-body text-sm font-semibold text-ink">
                  {testimonial.name}{" "}
                  {testimonial.is_featured && (
                    <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] text-gold">
                      FEATURED
                    </span>
                  )}
                  {!testimonial.is_published && (
                    <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] text-ink/50">
                      UNPUBLISHED
                    </span>
                  )}
                </p>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {testimonial.story}
                </p>
                <p className="mt-1 font-mono text-xs text-ink/40">
                  {CATEGORY_LABELS[testimonial.category]} -{" "}
                  {testimonial.location ?? "no location"}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => startEdit(testimonial)}
                  className="font-body text-sm text-baobab underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
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

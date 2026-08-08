"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";

type HeroSlide = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image_path: string;
  thumbnail_path: string | null;
  display_order: number;
  active: boolean;
};

const EMPTY_FORM = {
  title: "",
  description: "",
  image_path: "",
  thumbnail_path: "",
  display_order: 0,
  active: true,
};

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadSlides() {
    const data = await adminFetch<HeroSlide[]>("/hero-slides");
    setSlides(data);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/hero-slides/upload-image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setForm((f) => ({
        ...f,
        image_path: data.image_path,
        thumbnail_path: data.thumbnail_path,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadSlides().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.image_path) {
      setError("Please upload an image first.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await adminFetch(`/hero-slides/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/hero-slides", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm({
      title: slide.title,
      description: slide.description ?? "",
      image_path: slide.image_path,
      thumbnail_path: slide.thumbnail_path ?? "",
      display_order: slide.display_order,
      active: slide.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this slide?")) return;
    await adminFetch(`/hero-slides/${id}`, { method: "DELETE" });
    await loadSlides();
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
        CHF Admin
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">Manage Hero Slides</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Slide" : "Add New Slide"}
        </h2>

        {error && (
          <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Image</label>
          {form.image_path && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${form.image_path}`}
              alt="Preview"
              className="mt-2 h-32 w-full rounded object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="mt-2 block font-body text-sm text-ink/70"
          />
          {uploading && (
            <p className="mt-1 font-body text-xs text-ink/50">Uploading & optimizing...</p>
          )}
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Description (shown on detail page)
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">Display Order</label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) =>
                setForm({ ...form, display_order: Number(e.target.value) })
              }
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">Status</label>
            <select
              value={form.active ? "active" : "inactive"}
              onChange={(e) => setForm({ ...form, active: e.target.value === "active" })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Slide" : "Add Slide"}
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

      <div className="mt-8 max-w-3xl divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {slides.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No slides yet. Add your first one above.
          </p>
        )}
        {slides.map((slide) => (
          <div key={slide.id} className="flex items-start justify-between p-5">
            <div className="flex gap-4">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${slide.thumbnail_path ?? slide.image_path}`}
                alt={slide.title}
                className="h-16 w-24 rounded object-cover"
              />
              <div>
                <p className="font-body text-sm font-semibold text-ink">
                  {slide.title}{" "}
                  {!slide.active && (
                    <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] text-ink/50">
                      INACTIVE
                    </span>
                  )}
                </p>
                <p className="mt-1 font-body text-sm text-ink/60 line-clamp-2">
                  {slide.description}
                </p>
                <p className="mt-1 font-mono text-xs text-ink/40">
                  order: {slide.display_order}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => startEdit(slide)}
                className="font-body text-sm text-baobab underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(slide.id)}
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

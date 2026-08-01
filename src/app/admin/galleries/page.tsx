"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe, getToken } from "@/lib/adminApi";

type Gallery = {
  id: number;
  title: string;
  description: string;
  images_count: number;
};

type GalleryImage = {
  id: number;
  image_path: string;
  title: string;
};

const EMPTY_FORM = { title: "", description: "" };

export default function AdminGalleriesPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);

  async function loadGalleries() {
    const data = await adminFetch<Gallery[]>("/galleries");
    setGalleries(data);
  }

  useEffect(() => {
    fetchMe().then(async (me) => {
      if (!me) {
        router.push("/admin/login");
        return;
      }
      await loadGalleries();
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (editingId) {
        await adminFetch(`/galleries/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/galleries", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadGalleries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(gallery: Gallery) {
    setEditingId(gallery.id);
    setForm({ title: gallery.title, description: gallery.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this album and all its photos?")) return;
    await adminFetch(`/galleries/${id}`, { method: "DELETE" });
    await loadGalleries();
  }

  async function toggleExpand(gallery: Gallery) {
    if (expandedId === gallery.id) {
      setExpandedId(null);
      return;
    }
    const data = await adminFetch<GalleryImage[]>(`/galleries/${gallery.id}/images`);
    setImages(data);
    setExpandedId(gallery.id);
  }

  async function handleUpload(galleryId: number, file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message ?? "Upload failed");

      await adminFetch(`/galleries/${galleryId}/images`, {
        method: "POST",
        body: JSON.stringify({ image_path: uploadData.path }),
      });

      const refreshed = await adminFetch<GalleryImage[]>(`/galleries/${galleryId}/images`);
      setImages(refreshed);
      await loadGalleries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(imageId: number, galleryId: number) {
    if (!confirm("Delete this photo?")) return;
    await adminFetch(`/gallery-images/${imageId}`, { method: "DELETE" });
    const refreshed = await adminFetch<GalleryImage[]>(`/galleries/${galleryId}/images`);
    setImages(refreshed);
    await loadGalleries();
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
          Manage Photo Gallery Albums
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-ink/10 bg-white p-6"
        >
          <h2 className="font-body text-sm font-semibold text-ink">
            {editingId ? "Edit Album" : "Add New Album"}
          </h2>

          {error && (
            <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
              {error}
            </p>
          )}

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
              Description (optional)
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
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
                  ? "Update Album"
                  : "Add Album"}
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
          {galleries.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No albums yet. Add your first one above.
            </p>
          )}
          {galleries.map((gallery) => (
            <div key={gallery.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-sm font-semibold text-ink">
                    {gallery.title}
                  </p>
                  <p className="mt-1 font-body text-sm text-ink/60">
                    {gallery.description}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink/40">
                    {gallery.images_count} photo
                    {gallery.images_count === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => toggleExpand(gallery)}
                    className="font-body text-sm text-baobab underline"
                  >
                    {expandedId === gallery.id ? "Hide photos" : "Manage photos"}
                  </button>
                  <button
                    onClick={() => startEdit(gallery)}
                    className="font-body text-sm text-baobab underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="font-body text-sm text-clay underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedId === gallery.id && (
                <div className="mt-4 rounded border border-ink/10 bg-sand/50 p-4">
                  <label className="font-body text-sm text-ink/70">
                    Upload a photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(gallery.id, file);
                    }}
                    className="mt-1 block font-body text-sm text-ink/70"
                  />
                  {uploading && (
                    <p className="mt-2 font-body text-xs text-ink/50">
                      Uploading...
                    </p>
                  )}

                  <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${image.image_path}`}
                          alt={image.title}
                          className="aspect-square w-full rounded object-cover"
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id, gallery.id)}
                          className="mt-1 w-full font-body text-xs text-clay underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {images.length === 0 && (
                      <p className="col-span-full font-body text-xs text-ink/40">
                        No photos in this album yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

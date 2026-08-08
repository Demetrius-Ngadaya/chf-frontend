"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Entry = {
  id: number;
  title: string;
  description: string;
  category: string | null;
  image_path: string | null;
  video_url: string | null;
  is_published: boolean;
  order: number;
};

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  image_path: "",
  video_url: "",
  is_published: true,
  order: 0,
};

export default function AdminGivingBackPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadEntries() {
    const data = await adminFetch<Entry[]>("/giving-back");
    setEntries(data);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "giving-back");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setForm((f) => ({ ...f, image_path: data.path }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadEntries().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (editingId) {
        await adminFetch(`/giving-back/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/giving-back", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(entry: Entry) {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      description: entry.description,
      category: entry.category ?? "",
      image_path: entry.image_path ?? "",
      video_url: entry.video_url ?? "",
      is_published: entry.is_published,
      order: entry.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this entry?")) return;
    await adminFetch(`/giving-back/${id}`, { method: "DELETE" });
    await loadEntries();
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
      <h1 className="mt-1 font-display text-2xl text-ink">
        Manage Giving Back
      </h1>
      <p className="mt-2 max-w-2xl font-body text-sm text-ink/50">
        Stories, community activities, and donation impact shown on the
        public Giving Back page.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Entry" : "Add New Entry"}
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
              className="mt-2 h-40 w-full max-w-sm rounded object-cover"
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
            <p className="mt-1 font-body text-xs text-ink/50">Uploading...</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Category (optional)
            </label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Story, Community Activity, Impact"
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Description
          </label>
          <RichTextEditor
            key={editingId ?? "new"}
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Video URL (optional, YouTube or Vimeo)
          </label>
          <input
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Display Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <label className="mt-4 flex items-center gap-2 font-body text-sm text-ink/70">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
              setForm({ ...form, is_published: e.target.checked })
            }
          />
          Published (visible on public site)
        </label>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Entry" : "Add Entry"}
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
        {entries.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No entries yet. Add your first one above.
          </p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start justify-between p-5">
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {entry.title}{" "}
                {!entry.is_published && (
                  <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] text-ink/50">
                    UNPUBLISHED
                  </span>
                )}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                {entry.category ?? "uncategorized"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => startEdit(entry)}
                className="font-body text-sm text-baobab underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
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

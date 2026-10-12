"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Publication = {
  id: number;
  type: string;
  title: string;
  summary: string;
  authors: string[];
  category: string | null;
  published_on: string | null;
  file_path: string | null;
  cover_image_path: string | null;
};

const EMPTY = { type: "", title: "", summary: "", authors: "", category: "", published_on: "" };
const input =
  "mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab";

export default function AdminPublicationsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<Publication[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function load() {
    setItems(await adminFetch<Publication[]>("/publications"));
  }

  useEffect(() => {
    fetchMe().then(async (me) => {
      if (!me) {
        router.push("/admin/login");
        return;
      }
      const t = await adminFetch<string[]>("/publications/types");
      setTypes(t);
      setForm((f) => ({ ...f, type: t[0] ?? "" }));
      await load();
      setChecking(false);
    });
  }, [router]);

  function reset() {
    setForm({ ...EMPTY, type: types[0] ?? "" });
    setFile(null);
    setCover(null);
    setEditingId(null);
    setFormKey((k) => k + 1);
  }

  function startEdit(p: Publication) {
    setEditingId(p.id);
    setForm({
      type: p.type,
      title: p.title,
      summary: p.summary ?? "",
      authors: (p.authors ?? []).join(", "),
      category: p.category ?? "",
      published_on: p.published_on ?? "",
    });
    setFile(null);
    setCover(null);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (file) body.append("file", file);
      if (cover) body.append("cover", cover);
      await adminFetch(editingId ? `/publications/${editingId}` : "/publications", {
        method: "POST",
        body,
      });
      reset();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this publication?")) return;
    await adminFetch(`/publications/${id}`, { method: "DELETE" });
    if (editingId === id) reset();
    await load();
  }

  if (checking) return <AdminPageSkeleton />;

  return (
    <main className="min-h-screen bg-sand px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">CHF Admin</p>
        <h1 className="mt-1 font-display text-2xl text-ink">Research & Publications</h1>

        <form
          key={formKey}
          onSubmit={handleSubmit}
          className="mt-6 rounded-lg border border-ink/10 bg-white p-6"
        >
          <h2 className="font-display text-lg text-ink">
            {editingId ? "Edit publication" : "Add publication"}
          </h2>
          {error && (
            <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">{error}</p>
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="font-body text-sm text-ink/70">Type</label>
              <select
                className={input}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">Category (optional)</label>
              <input
                className={input}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Title</label>
            <input
              required
              className={input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Summary</label>
            <textarea
              rows={3}
              className={input}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="font-body text-sm text-ink/70">Authors (comma separated)</label>
              <input
                className={input}
                value={form.authors}
                onChange={(e) => setForm({ ...form, authors: e.target.value })}
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">Published on</label>
              <input
                type="date"
                className={input}
                value={form.published_on}
                onChange={(e) => setForm({ ...form, published_on: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="font-body text-sm text-ink/70">
                File (PDF/doc){editingId ? " – leave empty to keep current" : ""}
              </label>
              <input type="file" className={input} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">Cover image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className={input}
                onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-baobab px-6 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-ink/20 px-6 py-2 font-body text-sm text-ink/70"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {items.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">No publications yet.</p>
          )}
          {items.map((p) => (
            <div key={p.id} className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-clay">
                  {p.type.replace(/_/g, " ")}
                  {p.category ? ` · ${p.category}` : ""}
                  {p.published_on ? ` · ${p.published_on}` : ""}
                </p>
                <p className="mt-1 font-body text-sm font-semibold text-ink">{p.title}</p>
                {p.authors.length > 0 && (
                  <p className="mt-1 font-body text-xs text-ink/50">{p.authors.join(", ")}</p>
                )}
                {p.file_path && <p className="mt-1 font-mono text-[10px] text-ink/40">File attached</p>}
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(p)} className="font-body text-xs text-baobab underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="font-body text-xs text-clay underline">
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

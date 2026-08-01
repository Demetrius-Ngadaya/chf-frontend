"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe } from "@/lib/adminApi";

type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  is_published: boolean;
};

const EMPTY_FORM = { question: "", answer: "", category: "", order: 0 };

export default function AdminFaqsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadFaqs() {
    const data = await adminFetch<Faq[]>("/faqs");
    setFaqs(data);
  }

  useEffect(() => {
    fetchMe().then(async (me) => {
      if (!me) {
        router.push("/admin/login");
        return;
      }
      await loadFaqs();
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (editingId) {
        await adminFetch(`/faqs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/faqs", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadFaqs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(faq: Faq) {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category ?? "",
      order: faq.order,
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this FAQ?")) return;
    await adminFetch(`/faqs/${id}`, { method: "DELETE" });
    await loadFaqs();
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
        <h1 className="mt-1 font-display text-2xl text-ink">Manage FAQs</h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-ink/10 bg-white p-6"
        >
          <h2 className="font-body text-sm font-semibold text-ink">
            {editingId ? "Edit FAQ" : "Add New FAQ"}
          </h2>

          {error && (
            <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
              {error}
            </p>
          )}

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Question</label>
            <input
              required
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Answer</label>
            <textarea
              required
              rows={3}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <div className="flex-1">
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
            <div className="w-24">
              <label className="font-body text-sm text-ink/70">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
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
          {faqs.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No FAQs yet. Add your first one above.
            </p>
          )}
          {faqs.map((faq) => (
            <div key={faq.id} className="flex items-start justify-between p-5">
              <div>
                <p className="font-body text-sm font-semibold text-ink">
                  {faq.question}
                </p>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {faq.answer}
                </p>
                {faq.category && (
                  <p className="mt-1 font-mono text-xs text-ink/40">
                    {faq.category}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => startEdit(faq)}
                  className="font-body text-sm text-baobab underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
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

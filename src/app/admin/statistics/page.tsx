"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Statistic = {
  id: number;
  label: string;
  value: number;
  icon: string | null;
  suffix: string | null;
  order: number;
};

const EMPTY_FORM = {
  label: "",
  value: 0,
  icon: "",
  suffix: "",
  order: 0,
};

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    const data = await adminFetch<Statistic[]>("/statistics");
    setStats(data);
  }

  useEffect(() => {
    loadStats().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (editingId) {
        await adminFetch(`/statistics/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/statistics", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(s: Statistic) {
    setEditingId(s.id);
    setForm({
      label: s.label,
      value: s.value,
      icon: s.icon ?? "",
      suffix: s.suffix ?? "",
      order: s.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this statistic?")) return;
    await adminFetch(`/statistics/${id}`, { method: "DELETE" });
    await loadStats();
  }

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        CHF Admin
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">
        Manage Statistics
      </h1>
      <p className="mt-2 max-w-2xl font-body text-sm text-ink/50">
        The animated counters shown on the homepage (e.g. "5,000+ Patients
        Served").
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Statistic" : "Add New Statistic"}
        </h2>

        {error && (
          <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Label (e.g. "Patients Served")
          </label>
          <input
            required
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Value (number)
            </label>
            <input
              required
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Suffix (optional, e.g. "+")
            </label>
            <input
              value={form.suffix}
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Icon (optional)
          </label>
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
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

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Add Statistic"}
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
        {stats.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No statistics yet. Add your first one above.
          </p>
        )}
        {stats.map((s) => (
          <div key={s.id} className="flex items-start justify-between p-5">
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {s.value.toLocaleString()}
                {s.suffix ?? ""}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/40">{s.label}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => startEdit(s)}
                className="font-body text-sm text-baobab underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
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

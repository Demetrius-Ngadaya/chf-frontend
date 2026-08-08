"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";

type ResourceItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  year: number | null;
  file_path: string;
};

const TYPE_OPTIONS = [
  { value: "annual_report", label: "Annual Report" },
  { value: "strategic_plan", label: "Strategic Plan" },
  { value: "financial_statement", label: "Financial Statement" },
  { value: "registration_certificate", label: "Registration Certificate" },
  { value: "constitution", label: "Constitution" },
  { value: "safeguarding_policy", label: "Safeguarding Policy" },
];

const EMPTY_FORM = {
  type: "annual_report",
  title: "",
  description: "",
  file_path: "",
  year: "",
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadResources() {
    const data = await adminFetch<ResourceItem[]>("/resources");
    setResources(data);
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "resources");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setForm((f) => ({ ...f, file_path: data.path }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadResources().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.file_path) {
      setError("Please upload a file first.");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      year: form.year ? Number(form.year) : null,
    };

    try {
      if (editingId) {
        await adminFetch(`/resources/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/resources", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadResources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(resource: ResourceItem) {
    setEditingId(resource.id);
    setForm({
      type: resource.type,
      title: resource.title,
      description: resource.description ?? "",
      file_path: resource.file_path,
      year: resource.year ? String(resource.year) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this resource?")) return;
    await adminFetch(`/resources/${id}`, { method: "DELETE" });
    await loadResources();
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
      <h1 className="mt-1 font-display text-2xl text-ink">Manage Resources</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Resource" : "Add New Resource"}
        </h2>

        {error && (
          <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">File (PDF or document)</label>
          {form.file_path && (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${form.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block font-body text-sm text-baobab underline"
            >
              View uploaded file
            </a>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="mt-2 block font-body text-sm text-ink/70"
          />
          {uploading && (
            <p className="mt-1 font-body text-xs text-ink/50">Uploading...</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">Year (optional)</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
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
          <label className="font-body text-sm text-ink/70">Description (optional)</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Resource" : "Add Resource"}
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
        {resources.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No resources yet. Add your first one above.
          </p>
        )}
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-start justify-between p-5">
            <div>
              <p className="font-body text-sm font-semibold text-ink">{resource.title}</p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                {resource.type.replace("_", " ")}
                {resource.year ? ` · ${resource.year}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => startEdit(resource)}
                className="font-body text-sm text-baobab underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(resource.id)}
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

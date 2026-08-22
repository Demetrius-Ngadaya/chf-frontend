"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Partner = {
  id: number;
  name: string;
  description: string;
  category: string | null;
  website: string | null;
  country: string | null;
  address: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  projects_together: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "active" | "inactive";
  order: number;
  logo_path: string | null;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  website: "",
  country: "",
  address: "",
  contact_person: "",
  email: "",
  phone: "",
  projects_together: "",
  start_date: "",
  end_date: "",
  status: "active",
  order: 0,
  logo_path: "",
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadPartners() {
    const data = await adminFetch<Partner[]>("/partners");
    setPartners(data);
  }

  async function handleLogoUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "partners");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setForm((f) => ({ ...f, logo_path: data.path }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadPartners().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    try {
      if (editingId) {
        await adminFetch(`/partners/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/partners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadPartners();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(partner: Partner) {
    setEditingId(partner.id);
    setForm({
      name: partner.name,
      description: partner.description,
      category: partner.category ?? "",
      website: partner.website ?? "",
      country: partner.country ?? "",
      address: partner.address ?? "",
      contact_person: partner.contact_person ?? "",
      email: partner.email ?? "",
      phone: partner.phone ?? "",
      projects_together: partner.projects_together ?? "",
      start_date: partner.start_date ?? "",
      end_date: partner.end_date ?? "",
      status: partner.status,
      order: partner.order,
      logo_path: partner.logo_path ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this partner?")) return;
    await adminFetch(`/partners/${id}`, { method: "DELETE" });
    await loadPartners();
  }

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        CHF Admin
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">Manage Partners</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Partner" : "Add New Partner"}
        </h2>

        {error && (
          <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Logo</label>
          {form.logo_path && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${form.logo_path}`}
              alt="Preview"
              className="mt-2 h-20 w-20 rounded bg-white object-contain p-1"
            />
          )}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoUpload(file);
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
            <label className="font-body text-sm text-ink/70">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
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

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Projects Together (optional)
          </label>
          <textarea
            rows={2}
            value={form.projects_together}
            onChange={(e) =>
              setForm({ ...form, projects_together: e.target.value })
            }
            placeholder="e.g. Joint mobile health camps in Ifakara, 2023-2024"
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Website (optional)
            </label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Country (optional)
            </label>
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Address (optional)
          </label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Contact Person (optional)
            </label>
            <input
              value={form.contact_person}
              onChange={(e) =>
                setForm({ ...form, contact_person: e.target.value })
              }
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Email (optional)
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Phone (optional)
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Partnership Start Date (optional)
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Partnership End Date (optional)
            </label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
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
            {saving ? "Saving..." : editingId ? "Update Partner" : "Add Partner"}
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
        {partners.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No partners yet. Add your first one above.
          </p>
        )}
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex items-start justify-between p-5"
          >
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {partner.name}{" "}
                {partner.status === "inactive" && (
                  <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] text-ink/50">
                    INACTIVE
                  </span>
                )}
              </p>
              <p className="mt-1 font-body text-sm text-ink/60">
                {partner.description}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                {partner.category ?? "uncategorized"} -{" "}
                {partner.country ?? "no country"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => startEdit(partner)}
                className="font-body text-sm text-baobab underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(partner.id)}
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

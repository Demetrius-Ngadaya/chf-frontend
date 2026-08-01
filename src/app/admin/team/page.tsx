"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe, getToken } from "@/lib/adminApi";

type Member = {
  id: number;
  full_name: string;
  position: string;
  bio: string;
  qualifications: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  order: number;
  is_active: boolean;
  photo_path: string | null;
};

const EMPTY_FORM = {
  full_name: "",
  position: "",
  bio: "",
  qualifications: "",
  email: "",
  phone: "",
  linkedin_url: "",
  facebook_url: "",
  twitter_url: "",
  instagram_url: "",
  order: 0,
  is_active: true,
  photo_path: "",
};

export default function AdminTeamPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadMembers() {
    const data = await adminFetch<Member[]>("/team");
    setMembers(data);
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "team");

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
      await loadMembers();
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (editingId) {
        await adminFetch(`/team/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/team", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(member: Member) {
    setEditingId(member.id);
    setForm({
      full_name: member.full_name,
      position: member.position,
      bio: member.bio,
      qualifications: member.qualifications,
      email: member.email ?? "",
      phone: member.phone ?? "",
      linkedin_url: member.linkedin_url ?? "",
      facebook_url: member.facebook_url ?? "",
      twitter_url: member.twitter_url ?? "",
      instagram_url: member.instagram_url ?? "",
      order: member.order,
      is_active: member.is_active,
      photo_path: member.photo_path ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this team member?")) return;
    await adminFetch(`/team/${id}`, { method: "DELETE" });
    await loadMembers();
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
          Manage Team
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-ink/10 bg-white p-6"
        >
          <h2 className="font-body text-sm font-semibold text-ink">
            {editingId ? "Edit Team Member" : "Add New Team Member"}
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
                className="mt-2 h-24 w-24 rounded-full object-cover"
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
              <label className="font-body text-sm text-ink/70">
                Full Name
              </label>
              <input
                required
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                Position / Title
              </label>
              <input
                required
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Bio</label>
            <textarea
              required
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">
              Qualifications (optional)
            </label>
            <input
              value={form.qualifications}
              onChange={(e) =>
                setForm({ ...form, qualifications: e.target.value })
              }
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
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
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">
                LinkedIn URL (optional)
              </label>
              <input
                value={form.linkedin_url}
                onChange={(e) =>
                  setForm({ ...form, linkedin_url: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                Facebook URL (optional)
              </label>
              <input
                value={form.facebook_url}
                onChange={(e) =>
                  setForm({ ...form, facebook_url: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">
                Twitter / X URL (optional)
              </label>
              <input
                value={form.twitter_url}
                onChange={(e) =>
                  setForm({ ...form, twitter_url: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70">
                Instagram URL (optional)
              </label>
              <input
                value={form.instagram_url}
                onChange={(e) =>
                  setForm({ ...form, instagram_url: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70">
                Display Order
              </label>
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

          <label className="mt-4 flex items-center gap-2 font-body text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            Active (visible on public site)
          </label>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Member"
                  : "Add Member"}
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
          {members.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No team members yet. Add your first one above.
            </p>
          )}
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-start justify-between p-5"
            >
              <div>
                <p className="font-body text-sm font-semibold text-ink">
                  {member.full_name}{" "}
                  {!member.is_active && (
                    <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] text-ink/50">
                      INACTIVE
                    </span>
                  )}
                </p>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {member.position}
                </p>
                <p className="mt-1 font-mono text-xs text-ink/40">
                  {member.email ?? "no email"}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => startEdit(member)}
                  className="font-body text-sm text-baobab underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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

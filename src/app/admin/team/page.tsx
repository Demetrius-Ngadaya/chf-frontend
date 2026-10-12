"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

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
  experience: string | null;
  professional_affiliations: string | null;
  research_profile_url: string | null;
  publications: string | null;
  order: number;
  is_active: boolean;
  photo_path: string | null;
  cv_path: string | null;
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
  experience: "",
  professional_affiliations: "",
  research_profile_url: "",
  publications: "",
  order: 0,
  is_active: true,
  photo_path: "",
  cv_path: "",
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadMembers() {
    const data = await adminFetch<Member[]>("/team");
    setMembers(data);
  }

  async function uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Upload failed");
    return data.path;
  }

  async function handlePhotoUpload(file: File) {
    setUploadingPhoto(true);
    setError(null);
    try {
      const path = await uploadFile(file, "team");
      setForm((f) => ({ ...f, photo_path: path }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleCvUpload(file: File) {
    setUploadingCv(true);
    setError(null);
    try {
      const path = await uploadFile(file, "cv");
      setForm((f) => ({ ...f, cv_path: path }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCv(false);
    }
  }

  useEffect(() => {
    loadMembers().finally(() => setLoading(false));
  }, []);

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
      experience: member.experience ?? "",
      professional_affiliations: member.professional_affiliations ?? "",
      research_profile_url: member.research_profile_url ?? "",
      publications: member.publications ?? "",
      order: member.order,
      is_active: member.is_active,
      photo_path: member.photo_path ?? "",
      cv_path: member.cv_path ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this team member?")) return;
    await adminFetch(`/team/${id}`, { method: "DELETE" });
    await loadMembers();
  }

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        CHF Admin
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">Manage Team</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Team Member" : "Add New Team Member"}
        </h2>

        {error && (
          <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
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
              disabled={uploadingPhoto}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
              className="mt-2 block font-body text-sm text-ink/70"
            />
            {uploadingPhoto && (
              <p className="mt-1 font-body text-xs text-ink/50">Uploading...</p>
            )}
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">CV / Resume</label>
            {form.cv_path && (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${form.cv_path}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block font-body text-xs text-baobab underline"
              >
                Current CV file
              </a>
            )}
            <input
              type="file"
              accept="application/pdf,.doc,.docx"
              disabled={uploadingCv}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCvUpload(file);
              }}
              className="mt-2 block font-body text-sm text-ink/70"
            />
            {uploadingCv && (
              <p className="mt-1 font-body text-xs text-ink/50">Uploading...</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">Full Name</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
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
              onChange={(e) => setForm({ ...form, position: e.target.value })}
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
            onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Experience (optional)
          </label>
          <textarea
            rows={3}
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            placeholder="e.g. 10+ years in public health program management..."
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Professional Affiliations (optional)
          </label>
          <textarea
            rows={2}
            value={form.professional_affiliations}
            onChange={(e) =>
              setForm({ ...form, professional_affiliations: e.target.value })
            }
            placeholder="e.g. Member, Tanzania Medical Association"
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Publications (optional, one per line)
          </label>
          <textarea
            rows={3}
            value={form.publications}
            onChange={(e) => setForm({ ...form, publications: e.target.value })}
            placeholder={"Title of paper 1\nTitle of paper 2"}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Research Profile URL (optional)
          </label>
          <input
            value={form.research_profile_url}
            onChange={(e) =>
              setForm({ ...form, research_profile_url: e.target.value })
            }
            placeholder="e.g. Google Scholar or ResearchGate link"
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
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Facebook URL (optional)
            </label>
            <input
              value={form.facebook_url}
              onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
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
              onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Instagram URL (optional)
            </label>
            <input
              value={form.instagram_url}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Display Order</label>
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
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active (visible on public site)
        </label>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Member" : "Add Member"}
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
        {members.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No team members yet. Add your first one above.
          </p>
        )}
        {members.map((member) => (
          <div key={member.id} className="flex items-start justify-between p-5">
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
    </main>
  );
}

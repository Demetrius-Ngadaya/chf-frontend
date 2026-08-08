"use client";

import { useEffect, useState } from "react";
import { adminFetch, getToken } from "@/lib/adminApi";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Project = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string | null;
  status: "planned" | "ongoing" | "completed" | "suspended";
  location: string | null;
  budget: number | null;
  donor: string | null;
  beneficiaries_count: number | null;
  start_date: string | null;
  end_date: string | null;
  project_manager: string | null;
  is_featured: boolean;
  image_path: string | null;
  objectives: string | null;
  achievements: string | null;
  lessons_learned: string | null;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  status: "planned",
  location: "",
  budget: "",
  donor: "",
  beneficiaries_count: "",
  start_date: "",
  end_date: "",
  project_manager: "",
  is_featured: false,
  image_path: "",
  objectives: "",
  achievements: "",
  lessons_learned: "",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    const data = await adminFetch<Project[]>("/projects");
    setProjects(data);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "projects");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
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
    loadProjects().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      budget: form.budget === "" ? null : Number(form.budget),
      beneficiaries_count:
        form.beneficiaries_count === "" ? null : Number(form.beneficiaries_count),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };

    try {
      if (editingId) {
        await adminFetch(`/projects/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/projects", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      category: project.category ?? "",
      status: project.status,
      location: project.location ?? "",
      budget: project.budget?.toString() ?? "",
      donor: project.donor ?? "",
      beneficiaries_count: project.beneficiaries_count?.toString() ?? "",
      start_date: project.start_date ?? "",
      end_date: project.end_date ?? "",
      project_manager: project.project_manager ?? "",
      is_featured: project.is_featured,
      image_path: project.image_path ?? "",
      objectives: project.objectives ?? "",
      achievements: project.achievements ?? "",
      lessons_learned: project.lessons_learned ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await adminFetch(`/projects/${id}`, { method: "DELETE" });
    await loadProjects();
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
        Manage Projects
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Project" : "Add New Project"}
        </h2>

        {error && (
          <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Project Image
          </label>
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

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
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

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Category (optional)
            </label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Location (optional)
            </label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Donor (optional)
            </label>
            <input
              value={form.donor}
              onChange={(e) => setForm({ ...form, donor: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Budget, TZS (optional)
            </label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">
              Beneficiaries (optional)
            </label>
            <input
              type="number"
              value={form.beneficiaries_count}
              onChange={(e) =>
                setForm({ ...form, beneficiaries_count: e.target.value })
              }
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-ink/70">
              Start Date (optional)
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
              End Date (optional)
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
            Project Manager (optional)
          </label>
          <input
            value={form.project_manager}
            onChange={(e) =>
              setForm({ ...form, project_manager: e.target.value })
            }
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Objectives (optional)
          </label>
          <textarea
            rows={3}
            value={form.objectives}
            onChange={(e) => setForm({ ...form, objectives: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Achievements (optional)
          </label>
          <textarea
            rows={3}
            value={form.achievements}
            onChange={(e) => setForm({ ...form, achievements: e.target.value })}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            Lessons Learned (optional)
          </label>
          <textarea
            rows={3}
            value={form.lessons_learned}
            onChange={(e) =>
              setForm({ ...form, lessons_learned: e.target.value })
            }
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <label className="mt-4 flex items-center gap-2 font-body text-sm text-ink/70">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm({ ...form, is_featured: e.target.checked })
            }
          />
          Feature on homepage
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
                ? "Update Project"
                : "Add Project"}
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
        {projects.length === 0 && (
          <p className="p-6 font-body text-sm text-ink/50">
            No projects yet. Add your first one above.
          </p>
        )}
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-start justify-between p-5"
          >
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {project.name}{" "}
                {project.is_featured && (
                  <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] text-gold">
                    FEATURED
                  </span>
                )}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                {project.status} - {project.category ?? "uncategorized"} -{" "}
                {project.location ?? "no location"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => startEdit(project)}
                className="font-body text-sm text-baobab underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
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

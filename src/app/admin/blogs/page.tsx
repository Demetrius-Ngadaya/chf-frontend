"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe, getToken } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Blog = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string | null;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  published_at: string | null;
  views_count: number;
  cover_image_path: string | null;
};

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  status: "draft",
  is_featured: false,
  cover_image_path: "",
};

export default function AdminBlogsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadBlogs() {
    const data = await adminFetch<Blog[]>("/blogs");
    setBlogs(data);
  }

  async function handleCoverUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Upload failed");

      setForm((f) => ({ ...f, cover_image_path: data.path }));
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
      await loadBlogs();
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (editingId) {
        await adminFetch(`/blogs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/blogs", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(blog: Blog) {
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category ?? "",
      status: blog.status,
      is_featured: blog.is_featured,
      cover_image_path: blog.cover_image_path ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this blog post?")) return;
    await adminFetch(`/blogs/${id}`, { method: "DELETE" });
    await loadBlogs();
  }

  if (checking) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
          CHF Admin
        </p>
        <h1 className="mt-1 font-display text-2xl text-ink">
          Manage Blog Posts
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-ink/10 bg-white p-6"
        >
          <h2 className="font-body text-sm font-semibold text-ink">
            {editingId ? "Edit Post" : "Add New Post"}
          </h2>

          {error && (
            <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
              {error}
            </p>
          )}

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">
              Cover Image
            </label>
            {form.cover_image_path && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${form.cover_image_path}`}
                alt="Preview"
                className="mt-2 h-32 w-full max-w-sm rounded object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
              }}
              className="mt-2 block font-body text-sm text-ink/70"
            />
            {uploading && (
              <p className="mt-1 font-body text-xs text-ink/50">Uploading...</p>
            )}
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
            <label className="font-body text-sm text-ink/70">
              Excerpt (short summary, optional)
            </label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4">
            <label className="font-body text-sm text-ink/70">Content</label>
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
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
            <div>
              <label className="font-body text-sm text-ink/70">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 font-body text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) =>
                setForm({ ...form, is_featured: e.target.checked })
              }
            />
            Feature this post
          </label>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Post" : "Add Post"}
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
          {blogs.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No blog posts yet. Add your first one above.
            </p>
          )}
          {blogs.map((blog) => (
            <div key={blog.id} className="flex items-start justify-between p-5">
              <div>
                <p className="font-body text-sm font-semibold text-ink">
                  {blog.title}{" "}
                  {blog.is_featured && (
                    <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] text-gold">
                      FEATURED
                    </span>
                  )}
                </p>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {blog.excerpt || blog.content.slice(0, 120)}
                </p>
                <p className="mt-1 font-mono text-xs text-ink/40">
                  {blog.status} - {blog.category ?? "uncategorized"} -{" "}
                  {blog.views_count} views
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => startEdit(blog)}
                  className="font-body text-sm text-baobab underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
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

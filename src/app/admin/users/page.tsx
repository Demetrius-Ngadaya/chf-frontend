"use client";

import { useEffect, useState } from "react";
import { adminFetch, fetchMe } from "@/lib/adminApi";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string | null;
  created_at: string | null;
};

const EMPTY_FORM = { name: "", email: "", password: "", role: "" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    const data = await adminFetch<AdminUser[]>("/users");
    setUsers(data);
  }

  useEffect(() => {
    Promise.all([
      loadUsers(),
      adminFetch<string[]>("/roles").then(setRoles),
      fetchMe().then((me) => setCurrentUserId(me?.id ?? null)),
    ]).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload: Record<string, string> = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    if (form.password) payload.password = form.password;

    try {
      if (editingId) {
        await adminFetch(`/users/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/users", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this admin account? This cannot be undone.")) return;
    setError(null);
    try {
      await adminFetch(`/users/${id}`, { method: "DELETE" });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
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
        Administration
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">
        Admin User Accounts
      </h1>
      <p className="mt-2 max-w-2xl font-body text-sm text-ink/50">
        Manage who has access to this admin panel and what role they have.
        Roles control which sections each person can view or edit.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-2xl rounded-lg border border-ink/10 bg-white p-6"
      >
        <h2 className="font-body text-sm font-semibold text-ink">
          {editingId ? "Edit Admin Account" : "Add New Admin Account"}
        </h2>

        {error && (
          <p className="mt-3 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

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
            <label className="font-body text-sm text-ink/70">Email</label>
            <input
              required
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
              {editingId ? "New Password (leave blank to keep current)" : "Password"}
            </label>
            <input
              required={!editingId}
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
          </div>
          <div>
            <label className="font-body text-sm text-ink/70">Role</label>
            <select
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            >
              <option value="">Select a role...</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Account"
                : "Add Account"}
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
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-start justify-between p-5"
          >
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {user.name}{" "}
                {user.id === currentUserId && (
                  <span className="ml-2 rounded-full bg-baobab/15 px-2 py-0.5 font-mono text-[10px] text-baobab">
                    YOU
                  </span>
                )}
              </p>
              <p className="mt-1 font-body text-sm text-ink/60">
                {user.email}
              </p>
              <p className="mt-1 font-mono text-xs text-ink/40">
                {user.role ?? "no role"}
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => startEdit(user)}
                className="font-body text-sm text-baobab underline"
              >
                Edit
              </button>
              {user.id !== currentUserId && (
                <button
                  onClick={() => handleDelete(user.id)}
                  className="font-body text-sm text-clay underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

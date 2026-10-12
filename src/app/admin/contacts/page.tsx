"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  department: string | null;
  is_read: boolean;
  created_at: string | null;
};

export default function AdminContactsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);

  async function loadMessages(unread: boolean) {
    const query = unread ? "?unread_only=1" : "";
    const data = await adminFetch<ContactMessage[]>(`/contacts${query}`);
    setMessages(data);
  }

  useEffect(() => {
    fetchMe().then(async (me) => {
      if (!me) {
        router.push("/admin/login");
        return;
      }
      await loadMessages(false);
      setChecking(false);
    });
  }, [router]);

  async function handleToggleUnread() {
    const next = !unreadOnly;
    setUnreadOnly(next);
    await loadMessages(next);
  }

  async function handleMarkRead(id: number) {
    await adminFetch(`/contacts/${id}/read`, { method: "PUT" });
    await loadMessages(unreadOnly);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this message?")) return;
    await adminFetch(`/contacts/${id}`, { method: "DELETE" });
    await loadMessages(unreadOnly);
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
          Contact Messages
        </h1>

        <label className="mt-6 flex items-center gap-2 font-body text-sm text-ink/70">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={handleToggleUnread}
          />
          Show unread only
        </label>

        <div className="mt-6 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {messages.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No messages found.
            </p>
          )}
          {messages.map((message) => (
            <div key={message.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-sm font-semibold text-ink">
                    {message.name}{" "}
                    {!message.is_read && (
                      <span className="ml-2 rounded-full bg-clay/10 px-2 py-0.5 font-mono text-[10px] text-clay">
                        NEW
                      </span>
                    )}
                  </p>
                  <p className="mt-1 font-body text-sm text-ink/60">
                    {message.email} - {message.phone ?? "no phone"}
                  </p>
                  {message.subject && (
                    <p className="mt-1 font-body text-sm font-semibold text-ink/80">
                      {message.subject}
                    </p>
                  )}
                  <p className="mt-1 font-body text-sm text-ink/70">
                    {message.message}
                </p>
                  <p className="mt-1 font-mono text-xs text-ink/40">
                    {message.department ?? "General"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {!message.is_read && (
                    <button
                      onClick={() => handleMarkRead(message.id)}
                      className="font-body text-xs text-baobab underline"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="font-body text-xs text-clay underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

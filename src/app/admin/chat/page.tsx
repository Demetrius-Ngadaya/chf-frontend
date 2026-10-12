"use client";

import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Conversation = {
  id: number;
  visitor_name: string | null;
  visitor_email: string | null;
  status: "open" | "needs_human" | "closed";
  has_unread_admin_message: boolean;
  last_message: string | null;
  updated_at: string | null;
};

type Message = {
  id: number;
  sender: "visitor" | "bot" | "admin";
  message: string;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  open: "bg-ink/10 text-ink/50",
  needs_human: "bg-gold/20 text-gold",
  closed: "bg-baobab/15 text-baobab",
};

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function loadConversations() {
    const data = await adminFetch<Conversation[]>("/chat/conversations");
    setConversations(data);
  }

  async function loadThread(id: number) {
    const data = await adminFetch<{ messages: Message[] }>(
      `/chat/conversations/${id}`
    );
    setMessages(data.messages);
  }

  useEffect(() => {
    loadConversations().finally(() => setLoading(false));
    const interval = setInterval(loadConversations, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedId) loadThread(selectedId);
  }, [selectedId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function handleSelect(id: number) {
    setSelectedId(id);
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !reply.trim()) return;
    setSending(true);
    try {
      await adminFetch(`/chat/conversations/${selectedId}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: reply }),
      });
      setReply("");
      await loadThread(selectedId);
      await loadConversations();
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(status: string) {
    if (!selectedId) return;
    await adminFetch(`/chat/conversations/${selectedId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    await loadConversations();
  }

  if (loading) {
    return <AdminPageSkeleton />;
  }

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        CHF Admin
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">Live Chat</h1>

      <div className="mt-6 flex gap-6" style={{ height: "70vh" }}>
        <div className="w-80 shrink-0 overflow-y-auto rounded-lg border border-ink/10 bg-white">
          {conversations.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No conversations yet.
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`block w-full border-b border-ink/5 p-4 text-left transition-colors ${
                selectedId === c.id ? "bg-sand" : "hover:bg-sand/50"
              }`}
            >
              <p className="font-body text-sm font-semibold text-ink">
                {c.visitor_name || `Visitor #${c.id}`}{" "}
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${STATUS_STYLES[c.status]}`}
                >
                  {c.status.replace("_", " ")}
                </span>
              </p>
              <p className="mt-1 truncate font-body text-xs text-ink/50">
                {c.last_message ?? ""}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col rounded-lg border border-ink/10 bg-white">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="font-body text-sm text-ink/40">
                Select a conversation
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-ink/10 p-4">
                <div>
                  <p className="font-body text-sm font-semibold text-ink">
                    {selected.visitor_name || `Visitor #${selected.id}`}
                  </p>
                  {selected.visitor_email && (
                    <p className="font-mono text-xs text-ink/40">
                      {selected.visitor_email}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {selected.status !== "closed" && (
                    <button
                      onClick={() => handleStatusChange("closed")}
                      className="rounded-full border border-ink/20 px-3 py-1 font-body text-xs text-ink/70"
                    >
                      Close
                    </button>
                  )}
                  {selected.status === "closed" && (
                    <button
                      onClick={() => handleStatusChange("open")}
                      className="rounded-full border border-baobab px-3 py-1 font-body text-xs text-baobab"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-3 py-2 font-body text-sm ${
                        m.sender === "admin"
                          ? "bg-baobab text-sand"
                          : m.sender === "bot"
                            ? "bg-sand text-ink"
                            : "bg-clay/10 text-ink"
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleReply}
                className="flex gap-2 border-t border-ink/10 p-4"
              >
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type a reply..."
                  className="flex-1 rounded-full border border-ink/15 px-4 py-2 font-body text-sm outline-none focus:border-baobab"
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender: "visitor" | "bot" | "admin";
  message: string;
  created_at: string;
};

const STORAGE_KEY = "chf_chat_conversation_id";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string>("open");
  const [ready, setReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  // On mount, resume a saved conversation if one exists — this is what
  // lets a visitor refresh the page or come back hours later and still
  // see the full thread, including any reply the team sent while away.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const id = Number(saved);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${id}/messages`, {
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("expired");
          return res.json();
        })
        .then((data) => {
          setConversationId(id);
          setMessages(data.messages);
          setStatus(data.status);
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
        })
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  // Poll for new messages continuously in the background (not just while
  // open) so an unread badge could be added later, and so the widget is
  // always current the moment it's opened.
  useEffect(() => {
    if (!conversationId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/${conversationId}/messages`,
          { headers: { Accept: "application/json" } }
        );
        const data = await res.json();
        setMessages(data.messages);
        setStatus(data.status);
      } catch {
        // silent poll failure
      }
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conversationId]);

  async function openWidget() {
    setOpen(true);
    if (conversationId || !ready) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setConversationId(data.conversation_id);
      setMessages(data.messages);
      localStorage.setItem(STORAGE_KEY, String(data.conversation_id));
    } catch {
      // silent
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const text = input;
    setInput("");
    setSending(true);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "visitor", message: text, created_at: "" },
    ]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${conversationId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );
      const data = await res.json();
      setMessages(data.messages);
      setStatus(data.status);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  }

  function startNewConversation() {
    localStorage.removeItem(STORAGE_KEY);
    setConversationId(null);
    setMessages([]);
    openWidget();
  }

  return (
    <>
      {!open && (
        <button
          onClick={openWidget}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-baobab text-sand shadow-lg transition-transform hover:scale-105"
          aria-label="Open chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-baobab-dark px-4 py-3">
            <p className="font-body text-sm font-semibold text-sand">
              Caring Heart Foundation
            </p>
            <div className="flex items-center gap-3">
              {conversationId && (
                <button
                  onClick={startNewConversation}
                  title="Start a new conversation"
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-sand/60 hover:text-sand"
                >
                  New chat
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-sand/70 hover:text-sand"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 font-body text-sm ${
                    m.sender === "visitor"
                      ? "bg-baobab text-sand"
                      : m.sender === "admin"
                        ? "bg-clay/10 text-ink"
                        : "bg-sand text-ink"
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}
            {status === "needs_human" && (
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                Waiting for a team member — feel free to close this, your
                conversation is saved
              </p>
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-ink/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-full bg-baobab px-4 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

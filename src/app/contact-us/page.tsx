"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setFeedback(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          subject: subject || null,
          department: department || null,
          message: messageText,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
      } else {
        setStatus("error");
        setFeedback(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Could not reach the server. Please try again.");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
              Get In Touch
            </p>
            <h1 className="font-display text-4xl text-ink md:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 font-body text-ink/60">
              Have a question, want to partner with us, or need support?
              Reach out and our team will respond as soon as possible.
            </p>

            <div className="mt-10 space-y-4 font-body text-sm text-ink/70">
              <p>
                <span className="block font-mono text-xs uppercase tracking-[0.15em] text-ink/40">
                  Email
                </span>
                info@caringheartfoundation.or.tz
              </p>
              <p>
                <span className="block font-mono text-xs uppercase tracking-[0.15em] text-ink/40">
                  Registration Number
                </span>
                00NGO/R/7471
              </p>
              <p>
                <span className="block font-mono text-xs uppercase tracking-[0.15em] text-ink/40">
                  Location
                </span>
                Tanzania Mainland
              </p>
            </div>
          </div>

          <div>
            {status === "success" ? (
              <div className="rounded-lg border border-baobab/30 bg-baobab/5 p-6">
                <p className="font-body text-sm text-baobab">{feedback}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-lg border border-ink/10 bg-white p-6"
              >
                {status === "error" && feedback && (
                  <p className="mb-4 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
                    {feedback}
                  </p>
                )}

                <div>
                  <label className="font-body text-sm text-ink/70">
                    Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-ink/70">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm text-ink/70">
                      Phone (optional)
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-ink/70">
                      Subject (optional)
                    </label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm text-ink/70">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                    >
                      <option value="">General</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="Donations">Donations</option>
                      <option value="Volunteering">Volunteering</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-body text-sm text-ink/70">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-6 w-full rounded-full bg-baobab px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function BecomeAPartnerPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [proposal, setProposal] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partner-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          organization_name: organizationName,
          country: country || null,
          address: address || null,
          contact_person: contactPerson,
          phone,
          email,
          website: website || null,
          proposal: proposal || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Partnerships
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Become a Partner
          </h1>
          <p className="mt-4 font-body text-ink/60">
            Tell us about your organization and how you&apos;d like to work
            with Caring Heart Foundation.
          </p>

          {status === "success" ? (
            <div className="mt-10 rounded-lg border border-baobab/30 bg-baobab/5 p-6">
              <p className="font-body text-sm text-baobab">{message}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 rounded-lg border border-ink/10 bg-white p-6"
            >
              {status === "error" && message && (
                <p className="mb-4 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
                  {message}
                </p>
              )}

              <div>
                <label className="font-body text-sm text-ink/70">
                  Organization Name
                </label>
                <input
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Country (optional)
                  </label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Website (optional)
                  </label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Address (optional)
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Contact Person
                  </label>
                  <input
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Phone
                  </label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
              </div>

              <div className="mt-4">
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

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Proposal / How you&apos;d like to partner (optional)
                </label>
                <textarea
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 w-full rounded-full bg-baobab px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

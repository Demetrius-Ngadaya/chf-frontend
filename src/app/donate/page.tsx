"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

const PROVIDERS = [
  { value: "Mpesa", label: "M-Pesa" },
  { value: "Airtel", label: "Airtel Money" },
  { value: "Tigo", label: "Tigo Pesa" },
  { value: "Halopesa", label: "HaloPesa" },
  { value: "Azampesa", label: "AzamPesa" },
];

const AMOUNTS = [10000, 25000, 50000, 100000];

export default function DonatePage() {
  const [amount, setAmount] = useState<number | "">(25000);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [provider, setProvider] = useState("Mpesa");
  const [type, setType] = useState("one_time");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          donor_name: donorName || null,
          donor_email: donorEmail || null,
          donor_phone: donorPhone,
          is_anonymous: isAnonymous,
          type,
          amount: finalAmount,
          provider,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(
          `Check your phone (${donorPhone}) to enter your PIN and confirm the payment. Receipt: ${data.receipt_number}`
        );
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
            Support Our Work
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Donate
          </h1>
          <p className="mt-4 font-body text-ink/60">
            Every contribution reaches a real community across Tanzania. Pay
            securely with mobile money through AzamPay.
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

              <label className="font-body text-sm text-ink/70">
                Amount (TZS)
              </label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {AMOUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAmount(value);
                      setCustomAmount("");
                    }}
                    className={`rounded-full py-2 font-body text-sm ${
                      amount === value && !customAmount
                        ? "bg-baobab text-sand"
                        : "border border-ink/20 text-ink/70"
                    }`}
                  >
                    {value.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1000}
                placeholder="Or enter a custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="mt-3 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
              />

              <div className="mt-5">
                <label className="font-body text-sm text-ink/70">
                  Donation Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                >
                  <option value="one_time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <label className="mt-5 flex items-center gap-2 font-body text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                Donate anonymously
              </label>

              {!isAnonymous && (
                <div className="mt-4">
                  <label className="font-body text-sm text-ink/70">
                    Full Name (optional)
                  </label>
                  <input
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
              )}

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Email (optional, for receipt)
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Mobile Money Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Phone Number
                  </label>
                  <input
                    required
                    placeholder="255XXXXXXXXX"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "submitting" || !finalAmount || !donorPhone}
                className="mt-6 w-full rounded-full bg-clay px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {status === "submitting"
                  ? "Sending payment request..."
                  : `Donate ${finalAmount ? Number(finalAmount).toLocaleString() : ""} TZS`}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

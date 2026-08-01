"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-baobab-dark px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-sand p-8"
      >
        <div className="flex justify-center">
          <Image
            src="/images/logo.jpg"
            alt="Caring Heart Foundation"
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
        <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-clay">
          CHF Admin
        </p>
        <h1 className="mt-2 text-center font-display text-2xl text-ink">Sign in</h1>

        {error && (
          <p className="mt-4 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-6">
          <label className="font-body text-sm text-ink/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-ink/15 bg-white px-3 py-2 font-body text-sm text-ink outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-ink/15 bg-white px-3 py-2 font-body text-sm text-ink outline-none focus:border-baobab"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-baobab px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

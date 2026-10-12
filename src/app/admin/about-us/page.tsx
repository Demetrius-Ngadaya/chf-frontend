"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type AboutContent = {
  intro?: string;
  mission?: string;
  vision?: string;
  objectives?: string[];
};

export default function AdminAboutUsPage() {
  const [intro, setIntro] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<{ content: AboutContent | null }>("/pages/about-us/edit")
      .then((data) => {
        const content = data.content ?? {};
        setIntro(content.intro ?? "");
        setMission(content.mission ?? "");
        setVision(content.vision ?? "");
        setObjectives(
          content.objectives && content.objectives.length > 0
            ? content.objectives
            : [""]
        );
      })
      .finally(() => setLoading(false));
  }, []);

  function updateObjective(index: number, value: string) {
    setObjectives((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  function addObjective() {
    setObjectives((prev) => [...prev, ""]);
  }

  function removeObjective(index: number) {
    setObjectives((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await adminFetch("/pages/about-us/edit", {
        method: "PUT",
        body: JSON.stringify({
          intro,
          mission,
          vision,
          objectives: objectives.filter((o) => o.trim() !== ""),
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        CHF Admin
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">
        Manage About Us Page
      </h1>
      <p className="mt-2 max-w-2xl font-body text-sm text-ink/50">
        Our Mission, Our Vision, and What We Focus On — shown on the homepage
        and the About Us page.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6"
      >
        {error && (
          <p className="mb-4 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded bg-baobab/10 px-3 py-2 font-body text-sm text-baobab">
            Saved successfully.
          </p>
        )}

        <div>
          <label className="font-body text-sm text-ink/70">
            Intro Paragraph
          </label>
          <textarea
            required
            rows={4}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Our Mission</label>
          <textarea
            required
            rows={3}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">Our Vision</label>
          <textarea
            required
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
          />
        </div>

        <div className="mt-4">
          <label className="font-body text-sm text-ink/70">
            What We Focus On (objectives)
          </label>
          <div className="mt-2 space-y-2">
            {objectives.map((obj, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={obj}
                  onChange={(e) => updateObjective(i, e.target.value)}
                  placeholder={`Focus area ${i + 1}`}
                  className="flex-1 rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
                {objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(i)}
                    className="rounded-full border border-ink/20 px-3 font-body text-sm text-clay"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addObjective}
            className="mt-2 font-body text-sm text-baobab underline"
          >
            + Add another focus area
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 rounded-full bg-baobab px-5 py-2 font-body text-sm font-semibold text-sand disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}

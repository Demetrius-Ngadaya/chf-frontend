"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type PartnerApplication = {
  id: number;
  organization_name: string;
  country: string | null;
  address: string | null;
  contact_person: string;
  phone: string;
  email: string;
  website: string | null;
  proposal: string | null;
  status: "pending" | "reviewing" | "approved" | "rejected";
  created_at: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/20 text-gold",
  reviewing: "bg-ink/10 text-ink/60",
  approved: "bg-baobab/15 text-baobab",
  rejected: "bg-clay/15 text-clay",
};

export default function AdminPartnerApplicationsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadApplications(status: string) {
    const query = status ? `?status=${status}` : "";
    const data = await adminFetch<PartnerApplication[]>(
      `/partner-applications${query}`
    );
    setApplications(data);
  }

  useEffect(() => {
    fetchMe().then(async (me) => {
      if (!me) {
        router.push("/admin/login");
        return;
      }
      await loadApplications("");
      setChecking(false);
    });
  }, [router]);

  async function handleFilterChange(status: string) {
    setFilter(status);
    await loadApplications(status);
  }

  async function handleStatusChange(id: number, status: string) {
    setError(null);
    try {
      await adminFetch(`/partner-applications/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadApplications(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this application?")) return;
    await adminFetch(`/partner-applications/${id}`, { method: "DELETE" });
    await loadApplications(filter);
  }

  if (checking) {
    return <AdminPageSkeleton />;
  }

  return (
    <main className="min-h-screen bg-sand px-6 py-10 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
          CHF Admin
        </p>
        <h1 className="mt-1 font-display text-2xl text-ink">
          Partner Applications
        </h1>
        <p className="mt-2 font-body text-sm text-ink/50">
          Organizations apply through the public &quot;Become a Partner&quot;
          form (coming later); this page is for reviewing them.
        </p>

        {error && (
          <p className="mt-4 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          {["", "pending", "reviewing", "approved", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`rounded-full px-4 py-1.5 font-body text-sm ${
                  filter === status
                    ? "bg-baobab text-sand"
                    : "border border-ink/20 text-ink/70"
                }`}
              >
                {status === "" ? "All" : status}
              </button>
            )
          )}
        </div>

        <div className="mt-6 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {applications.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No partner applications found.
            </p>
          )}
          {applications.map((application) => (
            <div key={application.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-sm font-semibold text-ink">
                    {application.organization_name}{" "}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                        STATUS_STYLES[application.status]
                      }`}
                    >
                      {application.status}
                    </span>
                  </p>
                  <p className="mt-1 font-body text-sm text-ink/60">
                    {application.contact_person} - {application.email} -{" "}
                    {application.phone}
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink/40">
                    {application.country ?? "no country"}
                    {application.website ? ` - ${application.website}` : ""}
                  </p>
                  {application.proposal && (
                    <p className="mt-1 font-body text-sm text-ink/70">
                      {application.proposal}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex gap-2">
                    {application.status !== "reviewing" && (
                      <button
                        onClick={() =>
                          handleStatusChange(application.id, "reviewing")
                        }
                        className="rounded-full border border-ink/30 px-3 py-1 font-body text-xs text-ink/70"
                      >
                        Reviewing
                      </button>
                    )}
                    {application.status !== "approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(application.id, "approved")
                        }
                        className="rounded-full bg-baobab px-3 py-1 font-body text-xs font-semibold text-sand"
                      >
                        Approve
                      </button>
                    )}
                    {application.status !== "rejected" && (
                      <button
                        onClick={() =>
                          handleStatusChange(application.id, "rejected")
                        }
                        className="rounded-full border border-clay px-3 py-1 font-body text-xs font-semibold text-clay"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(application.id)}
                    className="font-body text-xs text-ink/40 underline"
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

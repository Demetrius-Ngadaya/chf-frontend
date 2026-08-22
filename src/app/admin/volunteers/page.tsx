"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, fetchMe } from "@/lib/adminApi";
import AdminPageSkeleton from "@/components/admin/AdminSkeleton";

type Volunteer = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  gender: string | null;
  education: string | null;
  occupation: string | null;
  skills: string[] | null;
  areas_of_interest: string[] | null;
  availability: string | null;
  experience: string | null;
  date_of_birth: string | null;
  motivation_letter: string | null;
  reference_name: string | null;
  reference_contact: string | null;
  photo_path: string | null;
  cv_path: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/20 text-gold",
  approved: "bg-baobab/15 text-baobab",
  rejected: "bg-clay/15 text-clay",
};

export default function AdminVolunteersPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function loadVolunteers(status: string) {
    const query = status ? `?status=${status}` : "";
    const data = await adminFetch<Volunteer[]>(`/volunteers${query}`);
    setVolunteers(data);
  }

  useEffect(() => {
    fetchMe().then(async (me) => {
      if (!me) {
        router.push("/admin/login");
        return;
      }
      await loadVolunteers("");
      setChecking(false);
    });
  }, [router]);

  async function handleFilterChange(status: string) {
    setFilter(status);
    await loadVolunteers(status);
  }

  async function handleStatusChange(id: number, status: string) {
    setError(null);
    try {
      await adminFetch(`/volunteers/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadVolunteers(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this volunteer application?")) return;
    await adminFetch(`/volunteers/${id}`, { method: "DELETE" });
    await loadVolunteers(filter);
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
          Volunteer Applications
        </h1>
        <p className="mt-2 font-body text-sm text-ink/50">
          People apply through the public volunteer form (coming later); this
          page is for reviewing, approving, or rejecting applications.
        </p>

        {error && (
          <p className="mt-4 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          {["", "pending", "approved", "rejected"].map((status) => (
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
          ))}
        </div>

        <div className="mt-6 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {volunteers.length === 0 && (
            <p className="p-6 font-body text-sm text-ink/50">
              No volunteer applications found.
            </p>
          )}
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {volunteer.photo_path && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${volunteer.photo_path}`}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-body text-sm font-semibold text-ink">
                      {volunteer.full_name}{" "}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                          STATUS_STYLES[volunteer.status]
                        }`}
                      >
                        {volunteer.status}
                      </span>
                    </p>
                    <p className="mt-1 font-body text-sm text-ink/60">
                      {volunteer.email} - {volunteer.phone}
                    </p>
                    <p className="mt-1 font-mono text-xs text-ink/40">
                      {volunteer.occupation ?? "no occupation"} -{" "}
                      {volunteer.availability ?? "no availability"}
                      {volunteer.date_of_birth
                        ? ` - DOB ${volunteer.date_of_birth}`
                        : ""}
                    </p>
                    {volunteer.skills && volunteer.skills.length > 0 && (
                      <p className="mt-1 font-body text-xs text-ink/50">
                        Skills: {volunteer.skills.join(", ")}
                      </p>
                    )}
                    {volunteer.areas_of_interest &&
                      volunteer.areas_of_interest.length > 0 && (
                        <p className="mt-1 font-body text-xs text-ink/50">
                          Interested in:{" "}
                          {volunteer.areas_of_interest.join(", ")}
                        </p>
                      )}
                    {volunteer.motivation_letter && (
                      <p className="mt-2 font-body text-xs italic text-ink/50">
                        "{volunteer.motivation_letter}"
                      </p>
                    )}
                    {(volunteer.reference_name || volunteer.reference_contact) && (
                      <p className="mt-1 font-mono text-xs text-ink/40">
                        Reference: {volunteer.reference_name ?? "?"}
                        {volunteer.reference_contact
                          ? ` (${volunteer.reference_contact})`
                          : ""}
                      </p>
                    )}
                    {volunteer.cv_path && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${volunteer.cv_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block font-body text-xs text-baobab underline"
                      >
                        View CV
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex gap-2">
                    {volunteer.status !== "approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(volunteer.id, "approved")
                        }
                        className="rounded-full bg-baobab px-3 py-1 font-body text-xs font-semibold text-sand"
                      >
                        Approve
                      </button>
                    )}
                    {volunteer.status !== "rejected" && (
                      <button
                        onClick={() =>
                          handleStatusChange(volunteer.id, "rejected")
                        }
                        className="rounded-full border border-clay px-3 py-1 font-body text-xs font-semibold text-clay"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(volunteer.id)}
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

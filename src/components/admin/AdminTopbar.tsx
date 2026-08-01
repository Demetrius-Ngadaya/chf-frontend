"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/adminApi";

export default function AdminTopbar({
  userName,
  onMenuClick,
}: {
  userName: string;
  onMenuClick: () => void;
}) {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/admin/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded p-2 text-ink/70 hover:bg-ink/5 md:hidden"
        aria-label="Open menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="hidden font-body text-sm text-ink/50 md:block">
        Caring Heart Foundation
      </div>

      <div className="flex items-center gap-4">
        <span className="font-body text-sm text-ink/70">{userName}</span>
        <button
          onClick={handleLogout}
          className="rounded-full border border-ink/20 px-4 py-1.5 font-body text-sm text-ink/70 hover:bg-ink/5"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

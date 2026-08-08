"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
        {label}
      </p>
      <div className="mt-3 flex gap-4">
        {units.map((u) => (
          <div key={u.label} className="text-center">
            <p className="font-display text-2xl tabular-nums text-ink">
              {u.value.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

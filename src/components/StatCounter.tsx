"use client";

import CountUp from "react-countup";

type Props = {
  value: number;
  suffix: string;
  label: string;
};

export default function StatCounter({ value, suffix, label }: Props) {
  return (
    <div className="text-center">
      <div className="font-mono text-3xl font-bold text-baobab md:text-4xl">
        <CountUp
          end={value}
          duration={2.5}
          separator=","
          enableScrollSpy
          scrollSpyOnce
        />
        {suffix}
      </div>
      <p className="mt-2 font-body text-sm text-ink/70">{label}</p>
    </div>
  );
}

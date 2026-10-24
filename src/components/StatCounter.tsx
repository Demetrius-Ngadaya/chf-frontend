"use client";

import CountUp from "react-countup";
import { Metric } from "@/components/design";

type Props = {
  value: number;
  suffix: string;
  label: string;
};

export default function StatCounter({ value, suffix, label }: Props) {
  return (
    <Metric
      dark
      label={label}
      value={
        <>
          <CountUp end={value} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
          {suffix}
        </>
      }
    />
  );
}

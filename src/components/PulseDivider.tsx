"use client";

import { motion } from "framer-motion";

export default function PulseDivider() {
  return (
    <div className="w-full overflow-hidden bg-sand py-2">
      <svg
        viewBox="0 0 1200 80"
        className="h-16 w-full text-clay"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 40 H420 L460 40 L480 10 L505 70 L530 20 L550 40 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

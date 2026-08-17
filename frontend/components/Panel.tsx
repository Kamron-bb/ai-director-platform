"use client";

import type { ReactNode } from "react";

export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "18px 20px 12px",
      }}
    >
      <h2
        style={{
          margin: "0 0 14px",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

"use client";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  accent?: boolean;
}

export function KpiCard({ label, value, unit, hint, accent }: KpiCardProps) {
  return (
    <div
      style={{
        background: "var(--surface)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "var(--border)",
        borderRadius: 12,
        padding: "16px 18px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
        }}
      >
        {label}
      </span>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          className="tnum"
          style={{
            fontSize: 27,
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: accent ? "var(--accent)" : "var(--text)",
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{unit}</span>
        )}
      </div>

      <span
        style={{
          fontSize: 11.5,
          color: "var(--text-faint)",
          minHeight: 16,
        }}
      >
        {hint ?? ""}
      </span>
    </div>
  );
}

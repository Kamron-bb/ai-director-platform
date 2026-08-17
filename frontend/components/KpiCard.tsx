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
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 118,
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
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
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.1,
            color: accent ? "var(--accent)" : "var(--text)",
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 14, color: "var(--text-dim)" }}>{unit}</span>
        )}
      </div>

      {hint && (
        <span style={{ fontSize: 12, color: "var(--text-faint)", marginTop: "auto" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

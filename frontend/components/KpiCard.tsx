"use client";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  color: string;
  icon: string;
}

export function KpiCard({ label, value, unit, hint, color, icon }: KpiCardProps) {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--surface)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "var(--border)",
        borderRadius: 12,
        padding: "16px 18px 14px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: color,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
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

        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.55, flexShrink: 0 }}
        >
          <path d={icon} />
        </svg>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          className="tnum"
          style={{
            fontSize: 27,
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color,
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

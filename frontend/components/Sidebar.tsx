"use client";

import { useI18n, type DictKey } from "@/lib/i18n";

export type View = "overview" | "terminals" | "segments";

const ITEMS: { id: View; label: DictKey; icon: string }[] = [
  { id: "overview", label: "overview", icon: "M3 12h4l3-8 4 16 3-8h4" },
  { id: "terminals", label: "terminals", icon: "M4 4h16v6H4zM4 14h16v6H4z" },
  { id: "segments", label: "segments", icon: "M4 18h4V8H4zM10 18h4V4h-4zM16 18h4v-7h-4z" },
];

export function Sidebar({
  active,
  onSelect,
}: {
  active: View;
  onSelect: (view: View) => void;
}) {
  const { t } = useI18n();

  return (
    <aside
      style={{
        width: 216,
        flexShrink: 0,
        background: "var(--surface)",
        borderRightWidth: 1,
        borderRightStyle: "solid",
        borderRightColor: "var(--border)",
        minHeight: "100vh",
        padding: "24px 12px",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 10px",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 700,
            color: "#04211d",
            flexShrink: 0,
          }}
        >
          AI
        </div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Director</div>
          <div style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em" }}>
            PLATFORM
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                width: "100%",
                padding: "10px 10px",
                borderRadius: 9,
                border: "none",
                background: isActive ? "var(--surface-2)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-dim)",
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d={item.icon} />
              </svg>
              {t(item.label)}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

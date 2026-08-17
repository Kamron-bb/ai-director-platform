"use client";

import type { Terminal } from "@/lib/api";
import { formatMoney, formatNumber } from "@/lib/format";

export function TerminalsMiniList({
  data,
  color = "var(--accent)",
}: {
  data: Terminal[];
  color?: string;
}) {
  if (!data.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((item, i) => (
        <div
          key={item.number}
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 12.5,
              color: "var(--text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ color: "var(--text-faint)", flexShrink: 0 }}>
              {i + 1}
            </span>
            {item.name}
          </span>
          <span
            className="tnum"
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color,
              flexShrink: 0,
              display: "flex",
              gap: 8,
              alignItems: "baseline",
            }}
          >
            {formatMoney(item.turnover)}
            <span
              style={{ fontSize: 10.5, fontWeight: 400, color: "var(--text-faint)" }}
            >
              {formatNumber(item.payments)}×
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

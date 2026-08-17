"use client";

import type { Segment } from "@/lib/api";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";

export function SegmentBars({ data }: { data: Segment[] }) {
  if (!data.length) return null;

  const max = Math.max(...data.map((s) => s.share));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((segment) => (
        <div key={segment.name}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text)" }}>
              {segment.name}
              <span style={{ color: "var(--text-faint)", marginLeft: 8, fontSize: 12 }}>
                {segment.count} терм.
              </span>
            </span>
            <span
              className="tnum"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)" }}
            >
              {formatPercent(segment.share)}
            </span>
          </div>

          <div
            style={{
              height: 8,
              background: "var(--surface-2)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(segment.share / max) * 100}%`,
                height: "100%",
                background: "var(--accent-dim)",
                borderRadius: 4,
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 5,
              fontSize: 11,
              color: "var(--text-faint)",
            }}
          >
            <span className="tnum">{formatMoney(segment.turnover)} сум</span>
            <span className="tnum">чек {formatNumber(segment.avg_check)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

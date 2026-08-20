"use client";

import type { RegionSummary } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";

const REGION_COLORS: Record<string, string> = {
  Ташкент: "var(--c-turnover)",
  Кашкадарья: "var(--c-payments)",
  Андижан: "var(--c-reward)",
};

export function RegionsPanel({ data }: { data: RegionSummary[] }) {
  const { t } = useI18n();
  if (!data.length) return null;

  const max = Math.max(...data.map((r) => r.share));
  const ranked = [...data].sort((a, b) => b.turnover - a.turnover);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {ranked.map((r) => {
        const color = REGION_COLORS[r.region] ?? "var(--c-network)";
        return (
          <div key={r.region}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text)" }}>
                {r.region}
                <span style={{ color: "var(--text-faint)", marginLeft: 8, fontSize: 12 }}>
                  {formatNumber(r.terminals)} {t("terminalsSuffix")}
                </span>
              </span>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color }}>
                {formatPercent(r.share)}
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
                  width: `${(r.share / max) * 100}%`,
                  height: "100%",
                  background: color,
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
              <span className="tnum">{formatMoney(r.turnover)} сум</span>
              <span className="tnum">
                {t("yieldPerMillion")} {formatNumber(r.yield_per_million)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

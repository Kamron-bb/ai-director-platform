"use client";

import type { EfficiencyItem } from "@/lib/api";
import { formatMoney, formatNumber } from "@/lib/format";

function Row({ item, positive }: { item: EfficiencyItem; positive: boolean }) {
  const width = Math.min(item.ratio_to_average / 4, 1) * 100;
  const color = positive ? "var(--positive)" : "var(--negative)";

  return (
    <div style={{ marginBottom: 13 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <span
          style={{
            fontSize: 12.5,
            color: "var(--text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </span>
        <span
          className="tnum"
          style={{ fontSize: 12.5, fontWeight: 600, color, flexShrink: 0 }}
        >
          {item.ratio_to_average.toFixed(1)}×
        </span>
      </div>

      <div
        style={{
          height: 5,
          background: "var(--surface-2)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: color,
            opacity: 0.75,
            borderRadius: 3,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          fontSize: 10.5,
          color: "var(--text-faint)",
        }}
      >
        <span className="tnum">{formatMoney(item.turnover)} оборот</span>
        <span className="tnum">{formatNumber(item.reward)} доход</span>
      </div>
    </div>
  );
}

export function EfficiencyPanel({
  best,
  worst,
  average,
}: {
  best: EfficiencyItem[];
  worst: EfficiencyItem[];
  average: number;
}) {
  if (!best.length) return null;

  const heading = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    marginBottom: 12,
  };

  return (
    <div>
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 12,
          color: "var(--text-dim)",
          lineHeight: 1.5,
        }}
      >
        Сколько дохода приносит миллион оборота. По сети —{" "}
        <span className="tnum" style={{ color: "var(--text)" }}>
          {formatNumber(average)} сум
        </span>
        . Разрыв между лучшим и худшим — 20-кратный.
      </p>

      <div className="split-1-1-wide">
        <div>
          <div style={{ ...heading, color: "var(--positive)" }}>
            Лучшая доходность
          </div>
          {best.map((item) => (
            <Row key={item.number} item={item} positive />
          ))}
        </div>

        <div>
          <div style={{ ...heading, color: "var(--negative)" }}>
            Худшая доходность
          </div>
          {worst.map((item) => (
            <Row key={item.number} item={item} positive={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

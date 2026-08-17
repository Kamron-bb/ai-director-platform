"use client";

import { useState } from "react";
import type { Bucket } from "@/lib/api";
import { formatMoney } from "@/lib/format";

const BAR_COLORS = [
  "var(--c-network)",
  "var(--c-payments)",
  "var(--c-turnover)",
  "var(--c-turnover)",
  "var(--c-reward)",
  "var(--c-reward)",
  "var(--c-check)",
];

const WIDTH = 640;
const HEIGHT = 260;
const PADDING = { top: 20, right: 16, bottom: 52, left: 40 };

const PLOT_W = WIDTH - PADDING.left - PADDING.right;
const PLOT_H = HEIGHT - PADDING.top - PADDING.bottom;

export function Histogram({ data }: { data: Bucket[] }) {
  const [hover, setHover] = useState<number | null>(null);

  if (!data.length) return null;

  const max = Math.max(...data.map((d) => d.count));
  const step = PLOT_W / data.length;
  const barWidth = step * 0.62;

  const ticks = [0, Math.round(max / 2), max];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {ticks.map((tick) => {
        const y = PADDING.top + PLOT_H - (tick / max) * PLOT_H;
        return (
          <g key={tick}>
            <line
              x1={PADDING.left}
              y1={y}
              x2={WIDTH - PADDING.right}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={PADDING.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--text-faint)"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {data.map((bucket, i) => {
        const barHeight = (bucket.count / max) * PLOT_H;
        const x = PADDING.left + i * step + (step - barWidth) / 2;
        const y = PADDING.top + PLOT_H - barHeight;
        const active = hover === i;

        return (
          <g
            key={bucket.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: "default" }}
          >
            <rect
              x={PADDING.left + i * step}
              y={PADDING.top}
              width={step}
              height={PLOT_H}
              fill="transparent"
            />
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="4"
              fill={BAR_COLORS[i % BAR_COLORS.length]}
              opacity={active ? 1 : 0.62}
            />
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize="12"
              fontWeight="500"
              fill="var(--text)"
            >
              {bucket.count}
            </text>
            <text
              x={x + barWidth / 2}
              y={HEIGHT - PADDING.bottom + 18}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-faint)"
            >
              {bucket.label.replace(" млн", "")}
            </text>
            {active && (
              <text
                x={x + barWidth / 2}
                y={HEIGHT - PADDING.bottom + 34}
                textAnchor="middle"
                fontSize="10"
                fill={BAR_COLORS[i % BAR_COLORS.length]}
              >
                {formatMoney(bucket.turnover)}
              </text>
            )}
          </g>
        );
      })}

      <line
        x1={PADDING.left}
        y1={PADDING.top + PLOT_H}
        x2={WIDTH - PADDING.right}
        y2={PADDING.top + PLOT_H}
        stroke="var(--border)"
        strokeWidth="1"
      />
      <text
        x={WIDTH - PADDING.right}
        y={HEIGHT - 6}
        textAnchor="end"
        fontSize="10"
        fill="var(--text-faint)"
      >
        оборот терминала, млн сум
      </text>
    </svg>
  );
}

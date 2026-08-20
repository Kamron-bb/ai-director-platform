"use client";

import type { Terminal } from "@/lib/api";
import { useI18n, type DictKey } from "@/lib/i18n";
import { formatMoney, formatNumber } from "@/lib/format";

const REGION_LABELS: Record<string, DictKey> = {
  Ташкент: "regionTashkent",
  Кашкадарья: "regionQashqadaryo",
  Андижан: "regionAndijon",
};

export function TerminalsMiniList({
  data,
  color = "var(--accent)",
  showRegion = false,
}: {
  data: Terminal[];
  color?: string;
  showRegion?: boolean;
}) {
  const { t } = useI18n();
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
            {showRegion && REGION_LABELS[item.region] && (
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: "var(--surface-2)",
                  color: "var(--text-faint)",
                }}
              >
                {t(REGION_LABELS[item.region])}
              </span>
            )}
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
              {formatNumber(item.payments)} {t("paymentsAbbr")}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { Terminal } from "@/lib/api";
import { useI18n, type DictKey } from "@/lib/i18n";
import { formatMoney, formatNumber } from "@/lib/format";

type SortKey = "turnover" | "payments" | "avg_check" | "reward";

const COLUMNS: { key: SortKey; label: DictKey }[] = [
  { key: "turnover", label: "turnover" },
  { key: "payments", label: "colPayments" },
  { key: "avg_check", label: "colAvgCheck" },
  { key: "reward", label: "colReward" },
];

export function TerminalsTable({ data }: { data: Terminal[] }) {
  const { t } = useI18n();
  const [sortKey, setSortKey] = useState<SortKey>("turnover");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data
      .filter(
        (item) =>
          !q ||
          item.name.toLowerCase().includes(q) ||
          String(item.number).includes(q),
      )
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [data, sortKey, query]);

  const cell = {
    padding: "9px 10px",
    fontSize: 13,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "var(--border)",
  } as const;

  const valueCell = (key: SortKey) => ({
    ...cell,
    textAlign: "right" as const,
    color: sortKey === key ? "var(--accent)" : "var(--text-dim)",
  });

  const headCell = {
    ...cell,
    fontSize: 11,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    userSelect: "none",
    textAlign: "right",
    whiteSpace: "nowrap",
  } as const;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        style={{
          width: "100%",
          background: "var(--surface-2)",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "var(--border)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 13,
          color: "var(--text)",
          marginBottom: 12,
          outline: "none",
        }}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  ...headCell,
                  textAlign: "left",
                  cursor: "default",
                  color: "var(--text-faint)",
                }}
              >
                {t("terminalName")}
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...headCell,
                    color:
                      sortKey === col.key ? "var(--accent)" : "var(--text-faint)",
                  }}
                  onClick={() => setSortKey(col.key)}
                >
                  {t(col.label)}
                  {sortKey === col.key ? " ↓" : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.number}>
                <td style={{ ...cell, color: "var(--text)" }}>
                  <span style={{ color: "var(--text-faint)", marginRight: 8 }}>
                    {item.number}
                  </span>
                  {item.name}
                  {!item.has_commission && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: "var(--surface-2)",
                        color: "var(--warning)",
                      }}
                    >
                      {t("noCommissionTag")}
                    </span>
                  )}
                </td>
                <td className="tnum" style={valueCell("turnover")}>
                  {formatMoney(item.turnover)}
                </td>
                <td className="tnum" style={valueCell("payments")}>
                  {formatNumber(item.payments)}
                </td>
                <td className="tnum" style={valueCell("avg_check")}>
                  {formatNumber(item.avg_check)}
                </td>
                <td className="tnum" style={valueCell("reward")}>
                  {formatNumber(item.reward)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!rows.length && (
        <p style={{ padding: 16, fontSize: 13, color: "var(--text-faint)" }}>
          {t("nothingFound")}
        </p>
      )}
    </div>
  );
}

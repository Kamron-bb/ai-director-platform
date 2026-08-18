"use client";

import { useMemo, useState } from "react";
import type { Rent } from "@/lib/api";
import { useI18n, type DictKey } from "@/lib/i18n";
import { formatMoney, formatNumber } from "@/lib/format";

type SortKey = "turnover" | "base_rent" | "rent_due";

const COLUMNS: { key: SortKey; label: DictKey }[] = [
  { key: "turnover", label: "turnover" },
  { key: "base_rent", label: "colBaseRent" },
  { key: "rent_due", label: "colRentDue" },
];

const REGION_OPTIONS: { value: string; label: DictKey }[] = [
  { value: "", label: "regionAll" },
  { value: "Ташкент", label: "regionTashkent" },
  { value: "Кашкадарья", label: "regionQashqadaryo" },
  { value: "Андижан", label: "regionAndijon" },
];

export function RentTable({ data }: { data: Rent[] }) {
  const { t } = useI18n();
  const [sortKey, setSortKey] = useState<SortKey>("rent_due");
  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data
      .filter(
        (item) =>
          !q ||
          item.name.toLowerCase().includes(q) ||
          String(item.number).includes(q),
      )
      .filter((item) => !regionFilter || item.region === regionFilter)
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [data, sortKey, query, regionFilter]);

  const total = useMemo(
    () => rows.reduce((sum, item) => sum + item.rent_due, 0),
    [rows],
  );

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

  const filterInputStyle = {
    background: "var(--surface-2)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--border)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "var(--text)",
    outline: "none",
  } as const;

  return (
    <div>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-faint)" }}>
        {t("rentHint")}
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          style={{ ...filterInputStyle, flex: "1 1 220px" }}
        />
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          style={{ ...filterInputStyle, cursor: "pointer" }}
        >
          {REGION_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {t(opt.label)}
            </option>
          ))}
        </select>
      </div>

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
                </td>
                <td className="tnum" style={valueCell("turnover")}>
                  {formatMoney(item.turnover)}
                </td>
                <td className="tnum" style={valueCell("base_rent")}>
                  {formatNumber(item.base_rent)}
                </td>
                <td className="tnum" style={valueCell("rent_due")}>
                  {formatNumber(item.rent_due)}
                </td>
              </tr>
            ))}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr>
                <td style={{ ...cell, color: "var(--text-faint)", fontWeight: 600 }}>
                  {t("count")}: {rows.length}
                </td>
                <td style={cell} />
                <td style={cell} />
                <td
                  className="tnum"
                  style={{ ...cell, textAlign: "right", color: "var(--accent)", fontWeight: 600 }}
                >
                  {formatNumber(total)}
                </td>
              </tr>
            </tfoot>
          )}
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

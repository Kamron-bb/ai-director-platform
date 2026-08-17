"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { KpiCard } from "@/components/KpiCard";
import { Panel } from "@/components/Panel";
import { Histogram } from "@/components/Histogram";
import { SegmentBars } from "@/components/SegmentBars";
import { TerminalsTable } from "@/components/TerminalsTable";
import { Sidebar, type View } from "@/components/Sidebar";
import { LoginScreen } from "@/components/LoginScreen";
import { useI18n } from "@/lib/i18n";
import {
  fetchSummary,
  fetchDistribution,
  fetchSegments,
  fetchTerminals,
  type Summary,
  type Bucket,
  type Segment,
  type Terminal,
} from "@/lib/api";
import { formatMoney, formatNumber } from "@/lib/format";

export default function Page() {
  const { t } = useI18n();
  const [authorized, setAuthorized] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorized) return;

    Promise.all([
      fetchSummary(),
      fetchDistribution(),
      fetchSegments(),
      fetchTerminals(215),
    ])
      .then(([s, d, g, tm]) => {
        setSummary(s);
        setBuckets(d);
        setSegments(g);
        setTerminals(tm);
      })
      .catch((e: Error) => setError(e.message));
  }, [authorized]);

  if (!authorized) {
    return <LoginScreen onSuccess={() => setAuthorized(true)} />;
  }

  const shell = {
    display: "flex",
    minHeight: "100vh",
    alignItems: "flex-start",
  } as const;

  if (error) {
    return (
      <div style={{ padding: 32, color: "var(--negative)" }}>
        {t("error")}: {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div style={{ padding: 32, color: "var(--text-dim)" }}>{t("loading")}…</div>
    );
  }

  return (
    <div style={shell}>
      <Sidebar active={view} onSelect={setView} />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          maxWidth: 1180,
          padding: "28px 32px 56px",
        }}
      >
        <Header period={summary.period} />

        {view === "overview" && (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <KpiCard
                label={t("turnover")}
                value={formatMoney(summary.turnover)}
                hint={`${t("sum")} за месяц`}
                accent
              />
              <KpiCard
                label={t("payments")}
                value={formatNumber(summary.payments)}
                hint={`${formatNumber(summary.payments / summary.terminals)} на терминал`}
              />
              <KpiCard
                label={t("reward")}
                value={formatMoney(summary.reward)}
                hint={`${(summary.reward / summary.turnover * 100).toFixed(3)}% от оборота`}
              />
              <KpiCard
                label={t("avgCheck")}
                value={formatNumber(summary.avg_check)}
                unit={t("sum")}
                hint={`${formatMoney(summary.commission)} ${t("sum")} комиссии`}
              />
              <KpiCard
                label={t("activeTerminals")}
                value={formatNumber(summary.terminals)}
                hint={`${formatMoney(summary.turnover / summary.terminals)} ${t("sum")} в среднем`}
              />
              <KpiCard
                label={t("noCommission")}
                value={formatNumber(summary.zero_commission_count)}
                hint={`${formatMoney(summary.zero_commission_turnover)} ${t("sum")} · ${(summary.zero_commission_turnover / summary.turnover * 100).toFixed(0)}% оборота`}
              />
            </section>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
                gap: 14,
                alignItems: "start",
              }}
            >
              <Panel title={t("distribution")}>
                <Histogram data={buckets} />
              </Panel>
              <Panel title={t("segmentTitle")}>
                <SegmentBars data={segments} />
              </Panel>
            </div>
          </>
        )}

        {view === "terminals" && (
          <Panel title={t("topTerminals")}>
            <TerminalsTable data={terminals} />
          </Panel>
        )}

        {view === "segments" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: 14,
              alignItems: "start",
            }}
          >
            <Panel title={t("segmentTitle")}>
              <SegmentBars data={segments} />
            </Panel>
            <Panel title={t("distribution")}>
              <Histogram data={buckets} />
            </Panel>
          </div>
        )}

        <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-faint)" }}>
          {t("dataNote")}
        </p>
      </main>
    </div>
  );
}

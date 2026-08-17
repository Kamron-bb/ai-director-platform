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
import { EfficiencyPanel } from "@/components/EfficiencyPanel";
import { useI18n } from "@/lib/i18n";
import {
  fetchSummary,
  fetchDistribution,
  fetchSegments,
  fetchTerminals,
  fetchEfficiency,
  type Summary,
  type Bucket,
  type Segment,
  type Terminal,
  type Efficiency,
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
  const [efficiency, setEfficiency] = useState<Efficiency | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authorized) return;

    Promise.all([
      fetchSummary(),
      fetchDistribution(),
      fetchSegments(),
      fetchTerminals(215),
      fetchEfficiency(),
    ])
      .then(([s, d, g, tm, ef]) => {
        setSummary(s);
        setBuckets(d);
        setSegments(g);
        setTerminals(tm);
        setEfficiency(ef);
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
                color="var(--c-turnover)"
                icon="M3 17l6-6 4 4 8-8M21 7v5h-5"
              />
              <KpiCard
                label={t("payments")}
                value={formatNumber(summary.payments)}
                hint={`${formatNumber(summary.payments / summary.terminals)} на терминал`}
                color="var(--c-payments)"
                icon="M3 10h18M7 15h4M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
              />
              <KpiCard
                label={t("reward")}
                value={formatMoney(summary.reward)}
                hint={`${(summary.reward / summary.turnover * 100).toFixed(3)}% от оборота`}
                color="var(--c-reward)"
                icon="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
              />
              <KpiCard
                label={t("avgCheck")}
                value={formatNumber(summary.avg_check)}
                unit={t("sum")}
                hint={`${formatMoney(summary.commission)} ${t("sum")} комиссии`}
                color="var(--c-check)"
                icon="M9 14l6-6M9.5 8.5h.01M14.5 13.5h.01M7 3h10a2 2 0 012 2v14l-3-2-2 2-2-2-2 2-3-2V5a2 2 0 012-2z"
              />
              <KpiCard
                label={t("activeTerminals")}
                value={formatNumber(summary.terminals)}
                hint={`${formatMoney(summary.turnover / summary.terminals)} ${t("sum")} в среднем`}
                color="var(--c-network)"
                icon="M9 3H5a2 2 0 00-2 2v4M15 3h4a2 2 0 012 2v4M9 21H5a2 2 0 01-2-2v-4M15 21h4a2 2 0 002-2v-4M12 10v4"
              />
              <KpiCard
                label={t("noCommission")}
                value={formatNumber(summary.zero_commission_count)}
                hint={`${formatMoney(summary.zero_commission_turnover)} ${t("sum")} · ${(summary.zero_commission_turnover / summary.turnover * 100).toFixed(0)}% оборота`}
                color="var(--c-alert)"
                icon="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
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

            {efficiency && (
              <div style={{ marginTop: 14 }}>
                <Panel title={t("efficiencyTitle")}>
                  <EfficiencyPanel
                    best={efficiency.best}
                    worst={efficiency.worst}
                    average={efficiency.average}
                  />
                </Panel>
              </div>
            )}
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

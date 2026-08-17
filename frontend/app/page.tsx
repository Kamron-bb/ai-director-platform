"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { KpiCard } from "@/components/KpiCard";
import { Panel } from "@/components/Panel";
import { Histogram } from "@/components/Histogram";
import { useI18n } from "@/lib/i18n";
import {
  fetchSummary,
  fetchDistribution,
  type Summary,
  type Bucket,
} from "@/lib/api";
import { formatMoney, formatNumber } from "@/lib/format";

export default function Page() {
  const { t } = useI18n();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchSummary(), fetchDistribution()])
      .then(([s, d]) => {
        setSummary(s);
        setBuckets(d);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <main style={{ padding: 32, color: "var(--negative)" }}>
        {t("error")}: {error}
      </main>
    );
  }

  if (!summary) {
    return (
      <main style={{ padding: 32, color: "var(--text-dim)" }}>
        {t("loading")}…
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px 48px" }}>
      <Header period={summary.period} />

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <KpiCard
          label={t("turnover")}
          value={formatMoney(summary.turnover)}
          unit={t("sum")}
          accent
        />
        <KpiCard label={t("payments")} value={formatNumber(summary.payments)} />
        <KpiCard
          label={t("reward")}
          value={formatMoney(summary.reward)}
          unit={t("sum")}
        />
        <KpiCard
          label={t("avgCheck")}
          value={formatNumber(summary.avg_check)}
          unit={t("sum")}
        />
        <KpiCard
          label={t("activeTerminals")}
          value={formatNumber(summary.terminals)}
        />
        <KpiCard
          label={t("noCommission")}
          value={formatNumber(summary.zero_commission_count)}
          hint={`${formatMoney(summary.zero_commission_turnover)} ${t("sum")}`}
        />
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <Panel title={t("distribution")}>
          <Histogram data={buckets} />
        </Panel>

        <Panel title={t("segmentTitle")}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)" }}>
            Скоро
          </p>
        </Panel>
      </div>

      <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-faint)" }}>
        {t("dataNote")}
      </p>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { KpiCard } from "@/components/KpiCard";
import { useI18n } from "@/lib/i18n";
import { fetchSummary, type Summary } from "@/lib/api";
import { formatMoney, formatNumber } from "@/lib/format";

export default function Page() {
  const { t } = useI18n();
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary()
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  if (error) {
    return (
      <main style={{ padding: 32, color: "var(--negative)" }}>
        {t("error")}: {error}
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: 32, color: "var(--text-dim)" }}>{t("loading")}…</main>
    );
  }

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
      <Header period={data.period} />

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 14,
        }}
      >
        <KpiCard
          label={t("turnover")}
          value={formatMoney(data.turnover)}
          unit={t("sum")}
          accent
        />
        <KpiCard label={t("payments")} value={formatNumber(data.payments)} />
        <KpiCard
          label={t("reward")}
          value={formatMoney(data.reward)}
          unit={t("sum")}
        />
        <KpiCard
          label={t("avgCheck")}
          value={formatNumber(data.avg_check)}
          unit={t("sum")}
        />
        <KpiCard
          label={t("activeTerminals")}
          value={formatNumber(data.terminals)}
        />
        <KpiCard
          label={t("noCommission")}
          value={formatNumber(data.zero_commission_count)}
          hint={`${formatMoney(data.zero_commission_turnover)} ${t("sum")}`}
        />
      </section>

      <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-faint)" }}>
        {t("dataNote")}
      </p>
    </main>
  );
}

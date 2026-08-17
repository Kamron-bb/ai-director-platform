"use client";

import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function Header({ period }: { period: string }) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();

  const btn = {
    background: "transparent",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--border)",
    borderRadius: 8,
    color: "var(--text-dim)",
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.15s ease, color 0.15s ease",
  } as const;

  const btnActive = {
    ...btn,
    background: "var(--accent)",
    borderColor: "var(--accent)",
    color: "#04211d",
  } as const;

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 24,
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>
          {t("subtitle")}
        </h1>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--text-dim)" }}>
          {period}
        </p>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button style={lang === "ru" ? btnActive : btn} onClick={() => setLang("ru")}>
          RU
        </button>
        <button style={lang === "uz" ? btnActive : btn} onClick={() => setLang("uz")}>
          UZ
        </button>
        <button style={btn} onClick={toggle}>
          {theme === "dark" ? "Светлая" : "Тёмная"}
        </button>
      </div>
    </header>
  );
}

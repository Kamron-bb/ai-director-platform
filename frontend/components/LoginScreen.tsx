"use client";

import { useState } from "react";
import { login } from "@/lib/api";

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!password.trim()) {
      setError(true);
      return;
    }
    setBusy(true);
    setError(false);
    try {
      await login(password);
      onSuccess();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 340,
          background: "var(--surface)",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "var(--border)",
          borderRadius: 14,
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
              color: "#04211d",
            }}
          >
            AI
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Director</div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-faint)",
                letterSpacing: "0.08em",
              }}
            >
              PLATFORM
            </div>
          </div>
        </div>

        <label
          style={{
            display: "block",
            fontSize: 12,
            color: "var(--text-dim)",
            marginBottom: 7,
          }}
        >
          Пароль доступа
        </label>

        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          style={{
            width: "100%",
            background: "var(--surface-2)",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: error ? "var(--negative)" : "var(--border)",
            borderRadius: 9,
            padding: "10px 12px",
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--text)",
            outline: "none",
          }}
        />

        {error && (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: "var(--negative)",
            }}
          >
            Неверный пароль
          </p>
        )}

        <button
          onClick={submit}
          disabled={busy}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "10px 12px",
            borderRadius: 9,
            border: "none",
            background: "var(--accent)",
            color: "#04211d",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? "Проверка…" : "Войти"}
        </button>
      </div>
    </div>
  );
}

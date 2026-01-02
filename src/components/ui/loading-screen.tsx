import { useParams } from "react-router";
import React from "react";

export default function LoadingPage() {
  const { lang } = useParams();

  const isUrlEn =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en");
  const currentLang = lang === "en" || (!lang && isUrlEn) ? "en" : "ar";

  const LOGO_PATH = `/images/logo/${currentLang}-light-logo.webp`;

  const texts = TRANSLATIONS[currentLang];

  return (
    <>
      <style>
        {`
          @keyframes loading-fill {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(-20%); }
            100% { transform: translateX(100%); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); opacity: 0.8; }
            50% { transform: translateY(-3px); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.overlay}>
        <div style={styles.container} role="status" aria-live="polite">
          <img
            src={LOGO_PATH}
            alt="Tashtiba Logo"
            fetchPriority="high"
            width={128}
            height={40}
            style={styles.logo}
          />

          <p style={styles.subtitle}>{texts.marketing_slogan}</p>

          <div style={styles.progressWrapper}>
            <div style={styles.progressBar} />
          </div>

          <p style={styles.loadingText}>{texts.loading}</p>
        </div>
      </div>
    </>
  );
}

/* 🟢 Inline Translations */
const TRANSLATIONS = {
  ar: {
    loading: "جاري التحميل...",
    marketing_slogan: "تشطيبة دليلك الشامل للتشطيبات في مصر",
  },
  en: {
    loading: "Loading...",
    marketing_slogan: "TashTiba: Your complete guide for finishing in Egypt",
  },
} as const;

/* 🎨 Styles */
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  container: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    maxWidth: 420,
    width: "100%",
  },

  logo: {
    width: 128,
    marginBottom: 24,
    animation: "pulse 2s infinite",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
  },

  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 40,
  },

  progressWrapper: {
    position: "relative",
    width: 256,
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 9999,
    overflow: "hidden",
    margin: "0 auto 16px",
  },

  progressBar: {
    position: "absolute",
    inset: 0,
    backgroundColor: "#dc2626",
    animation: "loading-fill 1.5s cubic-bezier(0.4,0,0.2,1) infinite",
  },

  loadingText: {
    fontSize: 14,
    color: "#9ca3af",
    animation: "bounce-slow 2s infinite ease-in-out",
  },
};

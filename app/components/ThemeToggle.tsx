"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const THEME_KEY = "hero4job_theme";
const LEGACY_THEME_KEY = "fastcv_theme";

type ThemeName = "light" | "dark";

function applyTheme(next: ThemeName) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-theme", next);
}

function resolveTheme(): ThemeName {
  const fromAttr = document.documentElement.getAttribute("data-theme");
  if (fromAttr === "light" || fromAttr === "dark") {
    return fromAttr;
  }

  const stored =
    window.localStorage.getItem(THEME_KEY) ??
    window.localStorage.getItem(LEGACY_THEME_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>("dark");

  useEffect(() => {
    setTheme(resolveTheme());
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }
    window.localStorage.setItem(THEME_KEY, theme);
    window.localStorage.setItem(LEGACY_THEME_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  const handleToggle = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <div className={styles.navItem}>
      <span className={styles.navLabel}>
        {theme === "dark" ? "Dark Mode" : "Light Mode"}
      </span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={handleToggle}
        />
        <span className={styles.slider} />
      </label>
    </div>
  );
}

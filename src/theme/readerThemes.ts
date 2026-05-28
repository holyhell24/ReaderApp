import type { ReaderTheme, ReaderThemeConfig } from "./types";

const STORAGE_KEY = "reader-app-theme";

export const readerThemes: Record<ReaderTheme, ReaderThemeConfig> = {
  light: {
    background: "#ffffff",
    foreground: "#111827",
    label: "Light",
    muted: "#6b7280",
  },
  dark: {
    background: "#111827",
    foreground: "#f9fafb",
    label: "Dark",
    muted: "#d1d5db",
  },
  gray: {
    background: "#f3f4f6",
    foreground: "#1f2937",
    label: "Gray",
    muted: "#4b5563",
  },
  sepia: {
    background: "#f4ecd8",
    foreground: "#3f2f1f",
    label: "Sepia",
    muted: "#7c6545",
  },
};

export function isReaderTheme(value: string | null): value is ReaderTheme {
  return value !== null && value in readerThemes;
}

export function loadReaderTheme(): ReaderTheme {
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    return isReaderTheme(storedTheme) ? storedTheme : "light";
  } catch {
    return "light";
  }
}

export function saveReaderTheme(theme: ReaderTheme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

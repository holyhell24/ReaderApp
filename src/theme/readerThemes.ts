import { ReaderTheme } from "../enums";
import type { ReaderThemeConfig } from "./types";

const STORAGE_KEY = "reader-app-theme";

export const readerThemes: Record<ReaderTheme, ReaderThemeConfig> = {
  [ReaderTheme.Light]: {
    background: "#ffffff",
    foreground: "#111827",
    label: "Light",
    muted: "#6b7280",
  },
  [ReaderTheme.Dark]: {
    background: "#111827",
    foreground: "#f9fafb",
    label: "Dark",
    muted: "#d1d5db",
  },
  [ReaderTheme.Gray]: {
    background: "#f3f4f6",
    foreground: "#1f2937",
    label: "Gray",
    muted: "#4b5563",
  },
  [ReaderTheme.Sepia]: {
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
    return isReaderTheme(storedTheme) ? storedTheme : ReaderTheme.Light;
  } catch {
    return ReaderTheme.Light;
  }
}

export function saveReaderTheme(theme: ReaderTheme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

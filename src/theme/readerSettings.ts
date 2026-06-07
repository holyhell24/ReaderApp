import type {
  ReaderFontConfig,
  ReaderFontFamily,
  ReaderIntervalConfig,
  ReaderLineHeightConfig,
  ReaderSettings,
  ReaderViewConfig,
} from "./types";
import { ReaderInterval, ReaderLineHeight, ReaderView } from "../enums";

const STORAGE_KEY = "reader-app-settings";

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontFamily: "cactus_classical_serif",
  fontSize: 20,
  interval: ReaderInterval.Normal,
  lineHeight: ReaderLineHeight.Normal,
  view: ReaderView.Pages,
  wordInterval: ReaderInterval.Normal,
};

export const MIN_READER_FONT_SIZE = 12;
export const MAX_READER_FONT_SIZE = 36;
export const READER_FONT_SIZE_STEP = 2;

export const readerFonts: Record<ReaderFontFamily, ReaderFontConfig> = {
  cactus_classical_serif: {
    cssValue: '"Cactus Classical Serif", Georgia, serif',
    label: "Cactus",
  },
  fast_serif: {
    cssValue: "Bionical, Georgia, serif",
    label: "Bionical",
  },
  spectral: {
    cssValue: "Spectral, Georgia, serif",
    label: "Spectral",
  },
  inter: {
    cssValue: "Inter, Arial, sans-serif",
    label: "Inter",
  },
  roboto: {
    cssValue: "Roboto, Arial, sans-serif",
    label: "Roboto",
  },
};

export const readerIntervals: Record<ReaderInterval, ReaderIntervalConfig> = {
  [ReaderInterval.Tight]: {
    cssValue: "0",
    label: "Tight",
  },
  [ReaderInterval.Normal]: {
    cssValue: "0.02em",
    label: "Normal",
  },
  [ReaderInterval.Wide]: {
    cssValue: "0.06em",
    label: "Wide",
  },
};

export const readerWordIntervals: Record<
  ReaderInterval,
  ReaderIntervalConfig
> = {
  [ReaderInterval.Tight]: {
    cssValue: "0",
    label: "Tight",
  },
  [ReaderInterval.Normal]: {
    cssValue: "0.08em",
    label: "Normal",
  },
  [ReaderInterval.Wide]: {
    cssValue: "0.18em",
    label: "Wide",
  },
};

export const readerLineHeights: Record<ReaderLineHeight, ReaderLineHeightConfig> = {
  [ReaderLineHeight.Tight]: {
    cssValue: "1.35",
    label: "Tight",
  },
  [ReaderLineHeight.Normal]: {
    cssValue: "1.6",
    label: "Normal",
  },
  [ReaderLineHeight.Wide]: {
    cssValue: "1.9",
    label: "Wide",
  },
};

export const readerViews: Record<ReaderView, ReaderViewConfig> = {
  [ReaderView.Scrolling]: {
    label: "Scrolling",
  },
  [ReaderView.Chapters]: {
    label: "Chapters",
  },
  [ReaderView.Pages]: {
    label: "Pages",
  },
};

function isReaderFontFamily(value: unknown): value is ReaderFontFamily {
  return typeof value === "string" && value in readerFonts;
}

function isReaderInterval(value: unknown): value is ReaderInterval {
  return typeof value === "string" && value in readerIntervals;
}

function isReaderLineHeight(value: unknown): value is ReaderLineHeight {
  return typeof value === "string" && value in readerLineHeights;
}

function isReaderView(value: unknown): value is ReaderView {
  return typeof value === "string" && value in readerViews;
}

function normalizeFontSize(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return DEFAULT_READER_SETTINGS.fontSize;
  }

  if (value > MAX_READER_FONT_SIZE && value <= 200) {
    return DEFAULT_READER_SETTINGS.fontSize;
  }

  return Math.min(
    MAX_READER_FONT_SIZE,
    Math.max(MIN_READER_FONT_SIZE, value),
  );
}

export function loadReaderSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_READER_SETTINGS;
    }

    const storedSettings = JSON.parse(raw) as Partial<ReaderSettings>;

    const fontFamily = isReaderFontFamily(storedSettings.fontFamily)
        ? storedSettings.fontFamily
        : DEFAULT_READER_SETTINGS.fontFamily;

    return {
      fontFamily,
      fontSize: normalizeFontSize(storedSettings.fontSize),
      interval: fontFamily === "fast_serif"
        ? ReaderInterval.Tight
        : isReaderInterval(storedSettings.interval)
        ? storedSettings.interval
        : DEFAULT_READER_SETTINGS.interval,
      lineHeight: isReaderLineHeight(storedSettings.lineHeight)
        ? storedSettings.lineHeight
        : DEFAULT_READER_SETTINGS.lineHeight,
      view: isReaderView(storedSettings.view)
        ? storedSettings.view
        : DEFAULT_READER_SETTINGS.view,
      wordInterval: isReaderInterval(storedSettings.wordInterval)
        ? storedSettings.wordInterval
        : DEFAULT_READER_SETTINGS.wordInterval,
    };
  } catch {
    return DEFAULT_READER_SETTINGS;
  }
}

export function saveReaderSettings(settings: ReaderSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

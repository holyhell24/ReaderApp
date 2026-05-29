import type {
  ReaderFontConfig,
  ReaderFontFamily,
  ReaderInterval,
  ReaderIntervalConfig,
  ReaderLineHeight,
  ReaderLineHeightConfig,
  ReaderSettings,
} from "./types";

const STORAGE_KEY = "reader-app-settings";

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontFamily: "cactus_classical_serif",
  fontSize: 22,
  interval: "normal",
  lineHeight: "normal",
};

export const MIN_READER_FONT_SIZE = 12;
export const MAX_READER_FONT_SIZE = 36;
export const READER_FONT_SIZE_STEP = 1;

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
  tight: {
    cssValue: "0",
    label: "Tight",
  },
  normal: {
    cssValue: "0.02em",
    label: "Normal",
  },
  wide: {
    cssValue: "0.06em",
    label: "Wide",
  },
};

export const readerLineHeights: Record<ReaderLineHeight, ReaderLineHeightConfig> = {
  tight: {
    cssValue: "1.35",
    label: "Tight",
  },
  normal: {
    cssValue: "1.6",
    label: "Normal",
  },
  wide: {
    cssValue: "1.9",
    label: "Wide",
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
        ? "tight"
        : isReaderInterval(storedSettings.interval)
        ? storedSettings.interval
        : DEFAULT_READER_SETTINGS.interval,
      lineHeight: isReaderLineHeight(storedSettings.lineHeight)
        ? storedSettings.lineHeight
        : DEFAULT_READER_SETTINGS.lineHeight,
    };
  } catch {
    return DEFAULT_READER_SETTINGS;
  }
}

export function saveReaderSettings(settings: ReaderSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

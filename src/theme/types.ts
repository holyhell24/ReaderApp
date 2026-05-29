export type ReaderTheme = "light" | "dark" | "gray" | "sepia";

export type ReaderFontFamily =
  | "cactus_classical_serif"
  | "fast_serif"
  | "spectral"
  | "inter"
  | "roboto";

export type ReaderInterval = "tight" | "normal" | "wide";

export type ReaderLineHeight = "tight" | "normal" | "wide";

export interface ReaderThemeConfig {
  background: string;
  foreground: string;
  label: string;
  muted: string;
}

export interface ReaderFontConfig {
  cssValue: string;
  label: string;
}

export interface ReaderIntervalConfig {
  cssValue: string;
  label: string;
}

export interface ReaderLineHeightConfig {
  cssValue: string;
  label: string;
}

export interface ReaderSettings {
  fontFamily: ReaderFontFamily;
  fontSize: number;
  interval: ReaderInterval;
  lineHeight: ReaderLineHeight;
}

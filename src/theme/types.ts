import type {
  ReaderInterval,
  ReaderLineHeight,
  ReaderView,
} from "../enums";

export type ReaderFontFamily =
  | "cactus_classical_serif"
  | "fast_serif"
  | "spectral"
  | "inter"
  | "roboto";

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

export interface ReaderViewConfig {
  label: string;
}

export interface ReaderSettings {
  fontFamily: ReaderFontFamily;
  fontSize: number;
  interval: ReaderInterval;
  lineHeight: ReaderLineHeight;
  view: ReaderView;
}

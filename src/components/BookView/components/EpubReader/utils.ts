import {
  readerFonts,
  ReaderInterval,
  readerIntervals,
  readerLineHeights,
  readerThemes,
  type ReaderSettings,
  type ReaderTheme,
} from "../../../../theme";

export function themeRules(theme: ReaderTheme, settings: ReaderSettings) {
  const colors = readerThemes[theme];
  const font = readerFonts[settings.fontFamily];
  const interval =
    readerIntervals[
      settings.fontFamily === "fast_serif"
        ? ReaderInterval.Tight
        : settings.interval
    ];
  const lineHeight = readerLineHeights[settings.lineHeight];

  return {
    a: {
      color: `${colors.muted} !important`,
    },
    body: {
      background: `${colors.background} !important`,
      color: `${colors.foreground} !important`,
      fontFamily: `${font.cssValue} !important`,
      fontSize: `${settings.fontSize}px !important`,
      letterSpacing: `${interval.cssValue} !important`,
      lineHeight: `${lineHeight.cssValue} !important`,
    },
    h1: {
      background: "transparent !important",
      border: "none !important",
      color: `${colors.foreground} !important`,
      textAlign: "center !important",
    },
    h2: {
      background: "transparent !important",
      border: "none !important",
      color: `${colors.foreground} !important`,
      textAlign: "center !important",
    },
    html: {
      background: `${colors.background} !important`,
      fontFamily: `${font.cssValue} !important`,
      fontSize: `${settings.fontSize}px !important`,
      letterSpacing: `${interval.cssValue} !important`,
      lineHeight: `${lineHeight.cssValue} !important`,
    },
    p: {
      color: `${colors.foreground} !important`,
      letterSpacing: `${interval.cssValue} !important`,
      lineHeight: `${lineHeight.cssValue} !important`,
    },
  };
}

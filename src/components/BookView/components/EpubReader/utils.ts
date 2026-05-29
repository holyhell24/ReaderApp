import { readerThemes, type ReaderTheme } from "../../../../theme";

export function themeRules(theme: ReaderTheme) {
  const colors = readerThemes[theme];

  return {
    a: {
      color: `${colors.muted} !important`,
    },
    body: {
      background: `${colors.background} !important`,
      color: `${colors.foreground} !important`,
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
    },
    p: {
      color: `${colors.foreground} !important`,
    },
  };
}

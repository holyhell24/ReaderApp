import type Contents from "epubjs/types/contents";
import {
  readerFonts,
  ReaderInterval,
  readerIntervals,
  readerLineHeights,
  readerThemes,
  readerWordIntervals,
  type ReaderSettings,
  type ReaderTheme,
} from "../../../../theme";
import type { ReaderLocationPayload, ReaderRendition } from "./types";

const FONT_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Cactus+Classical+Serif&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Spectral:wght@400;500;600;700&display=swap";
const BIONICAL_FONT_URL = new URL(
  "../../../../fonts/Fast_Serif.ttf",
  import.meta.url,
).href;

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
  const wordInterval = readerWordIntervals[settings.wordInterval];

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
      wordSpacing: `${wordInterval.cssValue} !important`,
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
      wordSpacing: `${wordInterval.cssValue} !important`,
    },
    p: {
      color: `${colors.foreground} !important`,
      letterSpacing: `${interval.cssValue} !important`,
      lineHeight: `${lineHeight.cssValue} !important`,
      wordSpacing: `${wordInterval.cssValue} !important`,
    },
  };
}

export function addFontStylesheet(contents: Contents) {
  void contents.addStylesheet(FONT_STYLESHEET_URL);
  void contents.addStylesheetCss(
    `
      @font-face {
        font-family: "Bionical";
        src: url("${BIONICAL_FONT_URL}") format("truetype");
        font-display: swap;
      }
    `,
    "bionical-font",
  );
}

export function applyContentStyles(
  contents: Contents,
  theme: ReaderTheme,
  settings: ReaderSettings,
) {
  const colors = readerThemes[theme];
  const rules = themeRules(theme, settings);
  const documentElement = contents.document.documentElement;
  const body = contents.document.body;

  documentElement.style.setProperty("background", colors.background, "important");
  documentElement.style.setProperty("color", colors.foreground, "important");
  documentElement.style.setProperty("min-height", "100%", "important");
  body.style.setProperty("background", colors.background, "important");
  body.style.setProperty("color", colors.foreground, "important");
  body.style.setProperty("min-height", "100%", "important");

  void contents.addStylesheetRules(
    {
      "body, html, #root, .calibre, .chapter, section, article, main, div": {
        background: `${colors.background} !important`,
        color: `${colors.foreground} !important`,
        fontFamily: rules.body.fontFamily,
        fontSize: rules.body.fontSize,
        letterSpacing: rules.body.letterSpacing,
        lineHeight: rules.body.lineHeight,
      },
      "body *": {
        background: "transparent !important",
        backgroundColor: "transparent !important",
        color: `${colors.foreground} !important`,
      },
      "a, a *": {
        color: `${colors.muted} !important`,
      },
    },
    "reader-theme-overrides",
  );
}

export function updateTheme(
  rendition: ReaderRendition,
  theme: ReaderTheme,
  settings: ReaderSettings,
) {
  const colors = readerThemes[theme];
  const font = readerFonts[settings.fontFamily];
  const interval =
    readerIntervals[
      settings.fontFamily === "fast_serif"
        ? ReaderInterval.Tight
        : settings.interval
    ];
  const lineHeight = readerLineHeights[settings.lineHeight];
  const wordInterval = readerWordIntervals[settings.wordInterval];
  const fontSize = `${settings.fontSize}px`;

  rendition.themes?.register(theme, themeRules(theme, settings));
  rendition.themes?.select(theme);
  rendition.themes?.font?.(font.cssValue);
  rendition.themes?.fontSize?.(fontSize);
  rendition.themes?.override("background", colors.background, true);
  rendition.themes?.override("color", colors.foreground, true);
  rendition.themes?.override("font-family", font.cssValue, true);
  rendition.themes?.override("font-size", fontSize, true);
  rendition.themes?.override("letter-spacing", interval.cssValue, true);
  rendition.themes?.override("line-height", lineHeight.cssValue, true);
  rendition.themes?.override("word-spacing", wordInterval.cssValue, true);
  applyRenditionContentStyles(rendition, theme, settings);
}

export function applyRenditionContentStyles(
  rendition: ReaderRendition,
  theme: ReaderTheme,
  settings: ReaderSettings,
) {
  const currentContents = rendition.getContents();

  if (Array.isArray(currentContents)) {
    currentContents.forEach((contents) => {
      applyContentStyles(contents, theme, settings);
    });
  } else if (currentContents) {
    applyContentStyles(currentContents, theme, settings);
  }
}

export function applyChapterStyles(
  rendition: ReaderRendition,
  theme: ReaderTheme,
  settings: ReaderSettings,
) {
  const rules = themeRules(theme, settings);

  rendition.themes?.default?.({
    ...rules,
    h1: {
      ...rules.h1,
      border: "none !important",
      background: "transparent !important",
      textAlign: "center !important",
    },
    h2: {
      ...rules.h2,
      border: "none !important",
      background: "transparent !important",
      textAlign: "center !important",
    },
  });
}

export function getHrefFromLocation(
  location: ReaderLocationPayload,
): string | null {
  if (!location) return null;

  if (location.start?.href) return location.start.href;

  return "href" in location ? location.href ?? null : null;
}

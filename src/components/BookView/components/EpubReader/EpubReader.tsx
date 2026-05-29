import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import type Contents from "epubjs/types/contents";
import { EpubViewStyle, ReactReader } from "react-reader";
import {
  readerFonts,
  readerIntervals,
  readerLineHeights,
  readerThemes,
  type ReaderSettings,
  type ReaderTheme,
} from "../../../../theme";
import { readerStyles } from "./styles";
import type { EpubReaderProps } from "./types";
import { themeRules } from "./utils";
import "./styles.css";

type ReaderRendition = Parameters<
  NonNullable<ComponentProps<typeof ReactReader>["getRendition"]>
>[0];

const FONT_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Cactus+Classical+Serif&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Spectral:wght@400;500;600;700&display=swap";
const BIONICAL_FONT_URL = new URL(
  "../../../../fonts/Fast_Serif.ttf",
  import.meta.url,
).href;

function addFontStylesheet(contents: Contents) {
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

function applyContentStyles(
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
  body.style.setProperty("background", colors.background, "important");
  body.style.setProperty("color", colors.foreground, "important");

  void contents.addStylesheetRules(
    {
      "body, html, #root, .calibre, .chapter, section, article, main": {
        background: `${colors.background} !important`,
        color: `${colors.foreground} !important`,
        fontFamily: rules.body.fontFamily,
        fontSize: rules.body.fontSize,
        letterSpacing: rules.body.letterSpacing,
        lineHeight: rules.body.lineHeight,
      },
      "body *": {
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

function updateTheme(
  rendition: ReaderRendition,
  theme: ReaderTheme,
  settings: ReaderSettings,
) {
  const colors = readerThemes[theme];
  const font = readerFonts[settings.fontFamily];
  const interval =
    readerIntervals[
      settings.fontFamily === "fast_serif" ? "tight" : settings.interval
    ];
  const lineHeight = readerLineHeights[settings.lineHeight];
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
  const currentContents = rendition.getContents();

  if (Array.isArray(currentContents)) {
    currentContents.forEach((contents) => {
      applyContentStyles(contents, theme, settings);
    });
  } else if (currentContents) {
    applyContentStyles(currentContents, theme, settings);
  }
}

function applyChapterStyles(
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

export default function EpubReader({
  location,
  onLocationChange,
  onTocChange,
  settings,
  theme,
  url,
}: EpubReaderProps) {
  const colors = readerThemes[theme];
  const [rendition, setRendition] = useState<ReaderRendition | null>(null);
  const themedReaderStyles = useMemo(
    () => ({
      ...readerStyles,
      container: {
        ...readerStyles.container,
        backgroundColor: colors.background,
        color: colors.foreground,
      },
      loadingView: {
        ...readerStyles.loadingView,
        backgroundColor: colors.background,
        color: colors.foreground,
      },
      readerArea: {
        ...readerStyles.readerArea,
        backgroundColor: colors.background,
      },
      reader: {
        ...readerStyles.reader,
        backgroundColor: colors.background,
      },
      swipeWrapper: {
        ...readerStyles.swipeWrapper,
        backgroundColor: colors.background,
      },
    }),
    [colors.background, colors.foreground],
  );
  const themedEpubViewStyles = useMemo(
    () => ({
      ...EpubViewStyle,
      view: {
        ...EpubViewStyle.view,
        backgroundColor: colors.background,
      },
      viewHolder: {
        ...EpubViewStyle.viewHolder,
        backgroundColor: colors.background,
      },
    }),
    [colors.background],
  );

  const handleRendition = useCallback(
    (nextRendition: ReaderRendition) => {
      nextRendition.hooks.content.register(addFontStylesheet);
      nextRendition.hooks.content.register((contents: Contents) => {
        applyContentStyles(contents, theme, settings);
      });
      applyChapterStyles(nextRendition, theme, settings);
      setRendition(nextRendition);
      updateTheme(nextRendition, theme, settings);
    },
    [settings, theme],
  );

  useEffect(() => {
    if (rendition) {
      updateTheme(rendition, theme, settings);
    }
  }, [rendition, settings, theme]);

  return (
    <div
      className="epub-reader h-full w-full"
      style={{ backgroundColor: colors.background }}
    >
      <ReactReader
        url={url}
        location={location}
        locationChanged={onLocationChange}
        showToc={false}
        readerStyles={themedReaderStyles}
        epubViewStyles={themedEpubViewStyles}
        getRendition={handleRendition}
        tocChanged={onTocChange}
      />
    </div>
  );
}

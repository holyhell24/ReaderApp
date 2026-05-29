import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";
import type Contents from "epubjs/types/contents";
import type { Location } from "epubjs/types/rendition";
import { EpubViewStyle, ReactReader } from "react-reader";
import {
  readerFonts,
  ReaderInterval,
  ReaderView,
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
type ReaderEpubOptions = ComponentProps<typeof ReactReader>["epubOptions"];
type ReaderLocationPayload =
  | Location
  | {
      href?: string;
      start?: {
        href?: string;
      };
    }
  | null
  | undefined;

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

function updateTheme(
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
  applyRenditionContentStyles(rendition, theme, settings);
}

function applyRenditionContentStyles(
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

function getHrefFromLocation(location: ReaderLocationPayload): string | null {
  if (!location) return null;

  if (location.start?.href) return location.start.href;

  return "href" in location ? location.href ?? null : null;
}

export default function EpubReader({
  location,
  onCurrentHrefChange,
  onLocationChange,
  onTocChange,
  settings,
  theme,
  url,
}: EpubReaderProps) {
  const colors = readerThemes[theme];
  const [rendition, setRendition] = useState<ReaderRendition | null>(null);
  const themeRef = useRef(theme);
  const settingsRef = useRef(settings);
  const isChaptersView = settings.view === ReaderView.Chapters;

  useEffect(() => {
    themeRef.current = theme;
    settingsRef.current = settings;
  }, [settings, theme]);

  const epubOptions = useMemo<ReaderEpubOptions>(() => {
    if (settings.view === ReaderView.Scrolling) {
      return {
        flow: "scrolled",
        manager: "continuous",
      };
    }

    if (settings.view === ReaderView.Chapters) {
      return {
        flow: "scrolled",
        manager: "default",
      };
    }

    return {
      flow: "paginated",
      manager: "default",
      spread: "auto",
    };
  }, [settings.view]);
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
      arrow: {
        ...readerStyles.arrow,
        color: "transparent",
        display:
          settings.view === ReaderView.Pages ? readerStyles.arrow.display : "none",
      },
      arrowHover: {
        ...readerStyles.arrowHover,
        color: colors.foreground,
      },
    }),
    [colors.background, colors.foreground, settings.view],
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
      nextRendition.on("relocated", (currentLocation: Location) => {
        const href = getHrefFromLocation(currentLocation);

        if (href) {
          onCurrentHrefChange(href);
        }

        applyRenditionContentStyles(
          nextRendition,
          themeRef.current,
          settingsRef.current,
        );
      });
      nextRendition.on("rendered", () => {
        applyRenditionContentStyles(
          nextRendition,
          themeRef.current,
          settingsRef.current,
        );
      });
      nextRendition.hooks.content.register(addFontStylesheet);
      nextRendition.hooks.content.register((contents: Contents) => {
        applyContentStyles(contents, themeRef.current, settingsRef.current);
      });
      applyChapterStyles(nextRendition, theme, settings);
      setRendition(nextRendition);
      updateTheme(nextRendition, theme, settings);
    },
    [onCurrentHrefChange, settings, theme],
  );

  useEffect(() => {
    if (rendition) {
      applyChapterStyles(rendition, theme, settings);
      updateTheme(rendition, theme, settings);
    }
  }, [rendition, settings, theme]);

  const handlePreviousChapter = () => {
    void rendition?.prev();
  };

  const handleNextChapter = () => {
    void rendition?.next();
  };

  return (
    <div
      className="epub-reader h-full w-full"
      style={{
        "--reader-control-color": colors.foreground,
        backgroundColor: colors.background,
        color: colors.foreground,
      } as CSSProperties}
    >
      <ReactReader
        key={`${settings.view}-${theme}`}
        url={url}
        location={location}
        locationChanged={onLocationChange}
        showToc={false}
        epubOptions={epubOptions}
        readerStyles={themedReaderStyles}
        epubViewStyles={themedEpubViewStyles}
        getRendition={handleRendition}
        tocChanged={onTocChange}
      />
      {isChaptersView && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
          <button
            type="button"
            onClick={handlePreviousChapter}
            className="pointer-events-auto cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium shadow transition-opacity hover:opacity-80"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.muted,
              color: colors.foreground,
            }}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNextChapter}
            className="pointer-events-auto cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium shadow transition-opacity hover:opacity-80"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.muted,
              color: colors.foreground,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

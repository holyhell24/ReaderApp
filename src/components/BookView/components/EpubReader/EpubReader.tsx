import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type Contents from "epubjs/types/contents";
import type { Location } from "epubjs/types/rendition";
import { EpubViewStyle, ReactReader } from "react-reader";
import { ReaderView, readerThemes } from "../../../../theme";
import { readerStyles } from "./styles";
import type {
  EpubReaderProps,
  ReaderEpubOptions,
  ReaderRendition,
} from "./types";
import {
  addFontStylesheet,
  applyChapterStyles,
  applyContentStyles,
  applyRenditionContentStyles,
  getHrefFromLocation,
  updateTheme,
} from "./utils";
import "./styles.css";

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
        right: 0,
      },
      swipeWrapper: {
        ...readerStyles.swipeWrapper,
        backgroundColor: colors.background,
      },
      arrow: {
        ...readerStyles.arrow,
        color: "transparent",
        display:
          settings.view === ReaderView.Pages
            ? readerStyles.arrow.display
            : "none",
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
      className={"epub-reader h-full w-full epub-reader--vertical-scroll"}
      style={
        {
          "--reader-control-color": colors.foreground,
          backgroundColor: colors.background,
          color: colors.foreground,
        } as CSSProperties
      }
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

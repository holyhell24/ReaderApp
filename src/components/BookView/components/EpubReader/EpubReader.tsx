import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import { ReactReader } from "react-reader";
import { readerThemes, type ReaderTheme } from "../../../../theme";
import { readerStyles } from "./styles";
import type { EpubReaderProps } from "./types";
import { themeRules } from "./utils";
import "./styles.css";

type ReaderRendition = Parameters<
  NonNullable<ComponentProps<typeof ReactReader>["getRendition"]>
>[0];

function updateTheme(rendition: ReaderRendition, theme: ReaderTheme) {
  const colors = readerThemes[theme];

  rendition.themes?.register(theme, themeRules(theme));
  rendition.themes?.select(theme);
  rendition.themes?.override("background", colors.background, true);
  rendition.themes?.override("color", colors.foreground, true);
}

function applyChapterStyles(rendition: ReaderRendition, theme: ReaderTheme) {
  rendition.themes?.default?.({
    ...themeRules(theme),
    h1: {
      ...themeRules(theme).h1,
      border: "none !important",
      background: "transparent !important",
      textAlign: "center !important",
    },
    h2: {
      ...themeRules(theme).h2,
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
  theme,
  url,
}: EpubReaderProps) {
  const colors = readerThemes[theme];
  const [rendition, setRendition] = useState<ReaderRendition | null>(null);
  const themedReaderStyles = useMemo(
    () => ({
      ...readerStyles,
      readerArea: {
        ...readerStyles.readerArea,
        backgroundColor: colors.background,
      },
    }),
    [colors.background],
  );

  const handleRendition = useCallback(
    (nextRendition: ReaderRendition) => {
      applyChapterStyles(nextRendition, theme);
      setRendition(nextRendition);
      updateTheme(nextRendition, theme);
    },
    [theme],
  );

  useEffect(() => {
    if (rendition) {
      updateTheme(rendition, theme);
    }
  }, [rendition, theme]);

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
        getRendition={handleRendition}
        tocChanged={onTocChange}
      />
    </div>
  );
}

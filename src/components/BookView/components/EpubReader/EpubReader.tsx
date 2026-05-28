import { useCallback, useState, type ComponentProps } from "react";
import { ReactReader } from "react-reader";
import { readerStyles } from "./styles";
import type { EpubReaderProps } from "./types";
import "./styles.css";

type ReaderRendition = Parameters<
  NonNullable<ComponentProps<typeof ReactReader>["getRendition"]>
>[0];

function applyChapterStyles(rendition: ReaderRendition) {
  rendition.themes?.default?.({
    h1: {
      border: "none !important",
      background: "transparent !important",
      textAlign: "center !important",
    },
    h2: {
      border: "none !important",
      background: "transparent !important",
      textAlign: "center !important",
    },
  });
}

export default function EpubReader({ url }: EpubReaderProps) {
  const [location, setLocation] = useState<string | number>(0);

  const handleRendition = useCallback(
    (nextRendition: ReaderRendition) => {
      applyChapterStyles(nextRendition);
    },
    [],
  );

  return (
    <div className="epub-reader h-full w-full bg-white">
      <ReactReader
        url={url}
        location={location}
        locationChanged={setLocation}
        showToc={false}
        readerStyles={readerStyles}
        getRendition={handleRendition}
      />
    </div>
  );
}

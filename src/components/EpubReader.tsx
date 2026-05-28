import { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import type { Rendition } from "epubjs";
import type { EpubReaderProps } from "./types";

function NavArrow({
  direction,
  label,
  onClick,
}: {
  direction: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-full w-12 shrink-0 items-center justify-center text-white opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden
      >
        {direction === "left" ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

export default function EpubReader({ url }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("EpubReader: loading url", url);
    if (!url || !viewerRef.current) return;

    setIsLoading(true);
    const book = ePub(url);
    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      flow: "paginated",
      manager: "default",
    });

    renditionRef.current = rendition;
    rendition.display().then(() => {
      console.log("EpubReader: rendition displayed");
      setIsLoading(false);
    }).catch((err) => {
      console.error("EpubReader: rendition display error", err);
      setIsLoading(false);
    });

    return () => {
      console.log("EpubReader: cleaning up");
      renditionRef.current = null;
      book.destroy();
    };
  }, [url]);

  return (
    <div className="flex h-full w-full">
      <NavArrow
        direction="left"
        label="Previous page"
        onClick={() => renditionRef.current?.prev()}
      />
      <div ref={viewerRef} className="relative h-full min-w-0 flex-1 bg-white">
        {isLoading && (
          <div className="flex h-full items-center justify-center text-gray-500">
            Loading book...
          </div>
        )}
      </div>
      <NavArrow
        direction="right"
        label="Next page"
        onClick={() => renditionRef.current?.next()}
      />
    </div>
  );
}

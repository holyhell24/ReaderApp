import { useEffect, useRef } from "react";
import ePub from "epubjs";
import type { Rendition } from "epubjs";
import type { EpubReaderProps } from "./types";

export default function EpubReader({ url }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);

  useEffect(() => {
    if (!url || !viewerRef.current) return;

    const book = ePub(url);
    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      spread: "none",
    });

    renditionRef.current = rendition;
    rendition.display();

    return () => {
      renditionRef.current = null;
      book.destroy();
    };
  }, [url]);

  return (
    <section className="mt-6">
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => renditionRef.current?.prev()}
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => renditionRef.current?.next()}
          className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div
        ref={viewerRef}
        className="h-[70vh] w-full overflow-hidden rounded-lg border border-gray-200 bg-white"
      />
    </section>
  );
}

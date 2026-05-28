import { useState } from "react";
import { Link } from "react-router-dom";
import EpubReader from "./components/EpubReader";
import type { ReaderTocItem } from "./components/EpubReader/types";
import type { BookViewProps } from "./types";

type OpenDrawer = "chapters" | "settings" | null;

function ChapterList({
  items,
  onSelect,
}: {
  items: ReaderTocItem[];
  onSelect: (href: string) => void;
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <button
            type="button"
            onClick={() => onSelect(item.href)}
            className="w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.label}
          </button>
          {item.subitems && item.subitems.length > 0 && (
            <div className="ml-3 border-l border-gray-200 pl-2">
              <ChapterList items={item.subitems} onSelect={onSelect} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function BookView({ book }: BookViewProps) {
  const [openDrawer, setOpenDrawer] = useState<OpenDrawer>(null);
  const [readerLocation, setReaderLocation] = useState<string | number>(0);
  const [toc, setToc] = useState<ReaderTocItem[]>([]);

  const closeDrawer = () => setOpenDrawer(null);

  const handleChapterSelect = (href: string) => {
    setReaderLocation(href);
    closeDrawer();
  };

  return (
    <main className="flex h-dvh w-full flex-col">
      <header className="flex w-full shrink-0 items-center gap-4 border-b border-gray-200 px-4 py-2">
        <Link
          to="/"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          &lt; Back
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-medium text-gray-900">
            {book.title}
          </h1>
          {book.author && (
            <p className="truncate text-xs text-gray-500">{book.author}</p>
          )}
        </div>
        <button
          type="button"
          aria-expanded={openDrawer === "chapters"}
          aria-controls="book-chapters-drawer"
          onClick={() => setOpenDrawer("chapters")}
          className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Chapters
        </button>
        <button
          type="button"
          aria-expanded={openDrawer === "settings"}
          aria-controls="book-settings-drawer"
          onClick={() => setOpenDrawer("settings")}
          className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Settings
        </button>
      </header>

      <section className="flex min-h-0 w-full flex-1">
        <div className="min-h-0 min-w-0 flex-1 bg-white">
          <EpubReader
            key={book.id}
            location={readerLocation}
            onLocationChange={setReaderLocation}
            onTocChange={setToc}
            url={book.url}
          />
        </div>
      </section>

      {openDrawer && (
        <>
          <button
            type="button"
            aria-label="Close drawer"
            className="fixed inset-0 z-20 cursor-pointer bg-black/20"
            onClick={closeDrawer}
          />
          {openDrawer === "chapters" && (
            <aside
              id="book-chapters-drawer"
              aria-label="Book chapters"
              className="fixed inset-y-0 right-0 z-30 flex w-96 max-w-[85vw] flex-col bg-white p-4 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Chapters
                </h2>
                <button
                  type="button"
                  aria-label="Close chapters"
                  onClick={closeDrawer}
                  className="cursor-pointer rounded-full px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
              <nav className="min-h-0 flex-1 overflow-y-auto">
                {toc.length > 0 ? (
                  <ChapterList items={toc} onSelect={handleChapterSelect} />
                ) : (
                  <p className="text-sm text-gray-500">No chapters found.</p>
                )}
              </nav>
            </aside>
          )}
          {openDrawer === "settings" && (
            <aside
              id="book-settings-drawer"
              aria-label="Book settings"
              className="fixed inset-y-0 right-0 z-30 flex w-80 max-w-[85vw] flex-col bg-white p-4 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Settings
                </h2>
                <button
                  type="button"
                  aria-label="Close settings"
                  onClick={closeDrawer}
                  className="cursor-pointer rounded-full px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
              <button
                type="button"
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </aside>
          )}
        </>
      )}
    </main>
  );
}

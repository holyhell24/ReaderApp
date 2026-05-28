import { useState } from "react";
import { Link } from "react-router-dom";
import EpubReader from "./components/EpubReader";
import type { BookViewProps } from "./types";

export default function BookView({ book }: BookViewProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
          aria-expanded={isSettingsOpen}
          aria-controls="book-settings-drawer"
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Settings
        </button>
      </header>

      <section className="flex min-h-0 w-full flex-1">
        <div className="min-h-0 min-w-0 flex-1 bg-white">
          <EpubReader key={book.id} url={book.url} />
        </div>
      </section>

      {isSettingsOpen && (
        <>
          <button
            type="button"
            aria-label="Close settings"
            className="fixed inset-0 z-20 bg-black/20"
            onClick={() => setIsSettingsOpen(false)}
          />
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
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-full px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
          </aside>
        </>
      )}
    </main>
  );
}

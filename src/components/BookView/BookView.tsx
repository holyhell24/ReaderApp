import { useState } from "react";
import { Link } from "react-router-dom";
import { readerThemes, type ReaderTheme } from "../../theme";
import EpubReader from "./components/EpubReader";
import type { ReaderTocItem } from "./components/EpubReader/types";
import type { BookViewProps } from "./types";

type OpenDrawer = "chapters" | "settings" | null;

function ChapterList({
  items,
  onSelect,
  themeColors,
}: {
  items: ReaderTocItem[];
  onSelect: (href: string) => void;
  themeColors: (typeof readerThemes)[ReaderTheme];
}) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <button
            type="button"
            onClick={() => onSelect(item.href)}
            className="w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm transition-opacity hover:opacity-80"
            style={{ color: themeColors.foreground }}
          >
            {item.label}
          </button>
          {item.subitems && item.subitems.length > 0 && (
            <div
              className="ml-3 border-l pl-2"
              style={{ borderColor: themeColors.muted }}
            >
              <ChapterList
                items={item.subitems}
                onSelect={onSelect}
                themeColors={themeColors}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function BookView({ book, onThemeChange, theme }: BookViewProps) {
  const [openDrawer, setOpenDrawer] = useState<OpenDrawer>(null);
  const [readerLocation, setReaderLocation] = useState<string | number>(0);
  const [toc, setToc] = useState<ReaderTocItem[]>([]);
  const themeColors = readerThemes[theme];

  const closeDrawer = () => setOpenDrawer(null);

  const handleChapterSelect = (href: string) => {
    setReaderLocation(href);
    closeDrawer();
  };

  const handleThemeChange = (nextTheme: ReaderTheme) => {
    onThemeChange(nextTheme);
  };

  return (
    <main
      className="flex h-dvh w-full flex-col"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.foreground,
      }}
    >
      <header
        className="flex w-full shrink-0 items-center gap-4 border-b px-4 py-2"
        style={{
          backgroundColor: themeColors.background,
          borderColor: themeColors.muted,
          color: themeColors.foreground,
        }}
      >
        <Link
          to="/"
          className="rounded-lg border px-3 py-2 text-sm transition-opacity hover:opacity-80"
          style={{
            borderColor: themeColors.muted,
            color: themeColors.foreground,
          }}
        >
          &lt; Back
        </Link>
        <div className="min-w-0 flex-1">
          <h1
            className="truncate text-sm font-medium"
            style={{ color: themeColors.foreground }}
          >
            {book.title}
          </h1>
          {book.author && (
            <p
              className="truncate text-xs"
              style={{ color: themeColors.muted }}
            >
              {book.author}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-expanded={openDrawer === "chapters"}
          aria-controls="book-chapters-drawer"
          onClick={() => setOpenDrawer("chapters")}
          className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            borderColor: themeColors.muted,
            color: themeColors.foreground,
          }}
        >
          Chapters
        </button>
        <button
          type="button"
          aria-expanded={openDrawer === "settings"}
          aria-controls="book-settings-drawer"
          onClick={() => setOpenDrawer("settings")}
          className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            borderColor: themeColors.muted,
            color: themeColors.foreground,
          }}
        >
          Settings
        </button>
      </header>

      <section className="flex min-h-0 w-full flex-1">
        <div className="min-h-0 min-w-0 flex-1">
          <EpubReader
            key={book.id}
            location={readerLocation}
            onLocationChange={setReaderLocation}
            onTocChange={setToc}
            theme={theme}
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
              className="fixed inset-y-0 right-0 z-30 flex w-96 max-w-[85vw] flex-col p-4 shadow-xl"
              style={{
                backgroundColor: themeColors.background,
                color: themeColors.foreground,
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="text-base font-semibold"
                  style={{ color: themeColors.foreground }}
                >
                  Chapters
                </h2>
                <button
                  type="button"
                  aria-label="Close chapters"
                  onClick={closeDrawer}
                  className="cursor-pointer rounded-full px-3 py-1 text-sm transition-opacity hover:opacity-80"
                  style={{ color: themeColors.muted }}
                >
                  Close
                </button>
              </div>
              <nav className="min-h-0 flex-1 overflow-y-auto">
                {toc.length > 0 ? (
                  <ChapterList
                    items={toc}
                    onSelect={handleChapterSelect}
                    themeColors={themeColors}
                  />
                ) : (
                  <p className="text-sm" style={{ color: themeColors.muted }}>
                    No chapters found.
                  </p>
                )}
              </nav>
            </aside>
          )}
          {openDrawer === "settings" && (
            <aside
              id="book-settings-drawer"
              aria-label="Book settings"
              className="fixed inset-y-0 right-0 z-30 flex w-80 max-w-[85vw] flex-col p-4 shadow-xl"
              style={{
                backgroundColor: themeColors.background,
                color: themeColors.foreground,
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="text-base font-semibold"
                  style={{ color: themeColors.foreground }}
                >
                  Settings
                </h2>
                <button
                  type="button"
                  aria-label="Close settings"
                  onClick={closeDrawer}
                  className="cursor-pointer rounded-full px-3 py-1 text-sm transition-opacity hover:opacity-80"
                  style={{ color: themeColors.muted }}
                >
                  Close
                </button>
              </div>
              <div>
                <h3
                  className="mb-2 text-sm font-medium"
                  style={{ color: themeColors.foreground }}
                >
                  Theme
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(readerThemes) as ReaderTheme[]).map((themeName) => (
                    <button
                      key={themeName}
                      type="button"
                      onClick={() => handleThemeChange(themeName)}
                      className="cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-medium transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor:
                          theme === themeName
                            ? themeColors.foreground
                            : "transparent",
                        borderColor:
                          theme === themeName
                            ? themeColors.foreground
                            : themeColors.muted,
                        color:
                          theme === themeName
                            ? themeColors.background
                            : themeColors.foreground,
                      }}
                    >
                      {readerThemes[themeName].label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className="mt-6 cursor-pointer rounded-lg border px-4 py-2 text-left text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  borderColor: themeColors.muted,
                  color: themeColors.foreground,
                }}
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

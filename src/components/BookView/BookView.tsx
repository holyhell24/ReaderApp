import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DrawerType } from "../../enums";
import {
  readerThemes,
  type ReaderSettings,
  type ReaderTheme,
} from "../../theme";
import type { SoundScene } from "../../types/types";
import { loadBookLocation, saveBookLocation } from "../../utils/bookStorage";
import Chapters from "./components/Drawers/Chapters";
import Settings from "./components/Drawers/Settings";
import Sounds from "./components/Drawers/Sounds";
import EpubReader from "./components/EpubReader";
import type { BookViewProps, ReaderTocItem } from "./types";
import { findSoundScene, findTocMatch, flattenToc } from "./utils";

export default function BookView({
  book,
  onSettingsChange,
  onSettingsReset,
  onThemeChange,
  settings,
  theme,
}: BookViewProps) {
  const [drawerType, setDrawerType] = useState<DrawerType | null>(null);
  const [readerLocation, setReaderLocation] = useState<string | number>(
    () => loadBookLocation(book.id) ?? 0,
  );
  const [currentReaderHref, setCurrentReaderHref] = useState<string | null>(null);
  const [isChromeVisible, setIsChromeVisible] = useState(false);
  const [soundScenes, setSoundScenes] = useState<SoundScene[]>([]);
  const [toc, setToc] = useState<ReaderTocItem[]>([]);
  const themeColors = readerThemes[theme];
  const tocMatches = useMemo(() => flattenToc(toc), [toc]);
  const activeSoundPreset = useMemo(() => {
    if (!currentReaderHref) return null;

    return findSoundScene(findTocMatch(tocMatches, currentReaderHref), soundScenes)
      ?.soundPreset ?? null;
  }, [currentReaderHref, soundScenes, tocMatches]);

  const closeDrawer = () => setDrawerType(null);

  const toggleChrome = useCallback(() => {
    setIsChromeVisible((isVisible) => !isVisible);
  }, []);

  const handleChapterSelect = (href: string) => {
    setReaderLocation(href);
    saveBookLocation(book.id, href);
    closeDrawer();
  };

  const handleThemeChange = (nextTheme: ReaderTheme) => {
    onThemeChange(nextTheme);
  };

  const handleSettingsChange = (nextSettings: ReaderSettings) => {
    onSettingsChange(nextSettings);
  };

  const handleLocationChange = (location: string) => {
    setReaderLocation(location);
    saveBookLocation(book.id, location);
  };

  const handleCurrentHrefChange = useCallback((href: string) => {
    setCurrentReaderHref(href);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSoundScenes() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}soundScenes/scene.json`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          setSoundScenes([]);
          return;
        }

        const data = (await response.json()) as SoundScene[];
        setSoundScenes(Array.isArray(data) ? data : []);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.warn("Unable to load sound scenes", error);
        setSoundScenes([]);
      }
    }

    void loadSoundScenes();

    return () => controller.abort();
  }, []);

  return (
    <main
      className="relative flex h-dvh w-full flex-col overflow-hidden"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.foreground,
      }}
    >
      <header
        className={`absolute inset-x-0 top-0 z-20 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b px-4 py-2 shadow-sm transition-opacity ${
          isChromeVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
        style={{
          backgroundColor: themeColors.background,
          borderColor: themeColors.muted,
          color: themeColors.foreground,
        }}
      >
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/"
            className="shrink-0 rounded-lg border px-3 py-2 text-sm transition-opacity hover:opacity-80"
            style={{
              borderColor: themeColors.muted,
              color: themeColors.foreground,
            }}
          >
            &lt; Back
          </Link>
          <div className="min-w-0">
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
        </div>
        <Sounds
          sceneSoundPreset={activeSoundPreset}
          sceneSoundPresetKey={currentReaderHref}
          themeColors={themeColors}
        />
        <div className="flex justify-end gap-4">
          <button
            type="button"
            aria-expanded={drawerType === DrawerType.Chapters}
            aria-controls="book-chapters-drawer"
            onClick={() => setDrawerType(DrawerType.Chapters)}
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
            aria-expanded={drawerType === DrawerType.Settings}
            aria-controls="book-settings-drawer"
            onClick={() => setDrawerType(DrawerType.Settings)}
            className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              borderColor: themeColors.muted,
              color: themeColors.foreground,
            }}
          >
            Settings
          </button>
        </div>
      </header>

      <section className="flex min-h-0 w-full flex-1">
        <div className="min-h-0 min-w-0 flex-1">
          <EpubReader
            key={`${book.id}-${settings.view}`}
            isChromeVisible={isChromeVisible}
            location={readerLocation}
            onCurrentHrefChange={handleCurrentHrefChange}
            onLocationChange={handleLocationChange}
            onReaderClick={toggleChrome}
            onTocChange={setToc}
            settings={settings}
            theme={theme}
            url={book.url}
          />
        </div>
      </section>

      {drawerType === DrawerType.Chapters && (
        <>
          <button
            type="button"
            aria-label="Close drawer"
            className="fixed inset-0 z-20 cursor-pointer bg-black/20"
            onClick={closeDrawer}
          />
          <Chapters
            onChapterSelect={handleChapterSelect}
            onClose={closeDrawer}
            themeColors={themeColors}
            toc={toc}
          />
        </>
      )}

      {drawerType === DrawerType.Settings && (
        <>
          <button
            type="button"
            aria-label="Close drawer"
            className="fixed inset-0 z-20 cursor-pointer bg-black/20"
            onClick={closeDrawer}
          />
          <Settings
            onClose={closeDrawer}
            onSettingsChange={handleSettingsChange}
            onSettingsReset={onSettingsReset}
            onThemeChange={handleThemeChange}
            settings={settings}
            theme={theme}
            themeColors={themeColors}
          />
        </>
      )}
    </main>
  );
}

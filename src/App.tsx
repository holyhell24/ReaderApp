import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import ReaderPage from "./pages/ReaderPage";
import {
  DEFAULT_READER_SETTINGS,
  loadReaderSettings,
  loadReaderTheme,
  readerThemes,
  ReaderTheme,
  saveReaderSettings,
  saveReaderTheme,
  type ReaderSettings,
} from "./theme";
import { loadLibrary } from "./utils/bookStorage";
import type { Book, BookMetadata, BooksState } from "./types/types";
import "./App.css";

function App() {
  const [isLibraryReady, setIsLibraryReady] = useState(false);
  const [library, setLibrary] = useState<BooksState>({
    activeBookId: null,
    items: [],
  });
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>(() =>
    loadReaderTheme(),
  );
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() =>
    loadReaderSettings(),
  );
  const themeColors = readerThemes[readerTheme];

  const handleThemeChange = (theme: ReaderTheme) => {
    setReaderTheme(theme);
    saveReaderTheme(theme);
  };

  const handleSettingsChange = (settings: ReaderSettings) => {
    setReaderSettings(settings);
    saveReaderSettings(settings);
  };

  const handleSettingsReset = () => {
    setReaderTheme(ReaderTheme.Light);
    saveReaderTheme(ReaderTheme.Light);
    setReaderSettings(DEFAULT_READER_SETTINGS);
    saveReaderSettings(DEFAULT_READER_SETTINGS);
  };

  const handleAddBook = useCallback((book: Book) => {
    setLibrary((currentLibrary) => ({
      activeBookId: book.id,
      items: [...currentLibrary.items, book],
    }));
  }, []);

  const handleUpdateBook = useCallback((id: string, metadata: Partial<BookMetadata>) => {
    setLibrary((currentLibrary) => ({
      ...currentLibrary,
      items: currentLibrary.items.map((book) =>
        book.id === id ? { ...book, ...metadata } : book,
      ),
    }));
  }, []);

  const handleRemoveBook = useCallback((id: string) => {
    setLibrary((currentLibrary) => {
      const items = currentLibrary.items.filter((book) => book.id !== id);
      const activeBookId =
        currentLibrary.activeBookId === id
          ? (items[0]?.id ?? null)
          : currentLibrary.activeBookId;

      return { activeBookId, items };
    });
  }, []);

  const handleActiveBookChange = useCallback((activeBookId: string | null) => {
    setLibrary((currentLibrary) => ({
      ...currentLibrary,
      activeBookId,
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadLibrary()
      .then((library) => {
        if (!cancelled) {
          setLibrary(library);
          setIsLibraryReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLibraryReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLibraryReady) {
    return (
      <main
        className="mx-auto min-h-dvh max-w-3xl p-6"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.foreground,
        }}
      >
        <p style={{ color: themeColors.muted }}>Loading library...</p>
      </main>
    );
  }

  return (
    <div
      className="min-h-dvh"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.foreground,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <LibraryPage
              activeBookId={library.activeBookId}
              books={library.items}
              onActiveBookChange={handleActiveBookChange}
              onBookAdd={handleAddBook}
              onBookRemove={handleRemoveBook}
              onBookUpdate={handleUpdateBook}
              onThemeChange={handleThemeChange}
              theme={readerTheme}
            />
          }
        />
        <Route
          path="/read/:bookId"
          element={
            <ReaderPage
              books={library.items}
              onActiveBookChange={handleActiveBookChange}
              onSettingsChange={handleSettingsChange}
              onSettingsReset={handleSettingsReset}
              onThemeChange={handleThemeChange}
              settings={readerSettings}
              theme={readerTheme}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import ReaderPage from "./pages/ReaderPage";
import { useAppDispatch } from "./store/hooks";
import { hydrateBooks } from "./store/booksSlice";
import {
  loadReaderTheme,
  readerThemes,
  saveReaderTheme,
  type ReaderTheme,
} from "./theme";
import { loadLibrary } from "./utils/bookStorage";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const [isLibraryReady, setIsLibraryReady] = useState(false);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>(() =>
    loadReaderTheme(),
  );
  const themeColors = readerThemes[readerTheme];

  const handleThemeChange = (theme: ReaderTheme) => {
    setReaderTheme(theme);
    saveReaderTheme(theme);
  };

  useEffect(() => {
    let cancelled = false;

    loadLibrary()
      .then((library) => {
        if (!cancelled) {
          dispatch(hydrateBooks(library));
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
  }, [dispatch]);

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
              onThemeChange={handleThemeChange}
              theme={readerTheme}
            />
          }
        />
        <Route
          path="/read/:bookId"
          element={
            <ReaderPage
              onThemeChange={handleThemeChange}
              theme={readerTheme}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;

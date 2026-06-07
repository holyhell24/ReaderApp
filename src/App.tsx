import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import ReaderPage from "./pages/ReaderPage";
import { useLibrary } from "./hooks/useLibrary";
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
import "./App.css";

function App() {
  const { addBook, isLibraryReady, library, removeBook, selectBook } =
    useLibrary();
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

  if (!isLibraryReady) {
    return (
      <main
        className="mx-auto min-h-dvh max-w-3xl p-6"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.foreground,
          filter: `brightness(${readerSettings.appBrightness}%)`,
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
        filter: `brightness(${readerSettings.appBrightness}%)`,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <LibraryPage
              activeBookId={library.activeBookId}
              books={library.items}
              onBookAdd={addBook}
              onBookRemove={removeBook}
              onBookSelect={selectBook}
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
              onActiveBookChange={selectBook}
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

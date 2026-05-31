import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import BookView from "../components/BookView";
import type { ReaderSettings, ReaderTheme } from "../theme";
import type { Book } from "../types/types";
import { saveActiveBookId } from "../utils/bookStorage";

interface ReaderPageProps {
  books: Book[];
  onActiveBookChange: (bookId: string | null) => void;
  onSettingsChange: (settings: ReaderSettings) => void;
  onSettingsReset: () => void;
  onThemeChange: (theme: ReaderTheme) => void;
  settings: ReaderSettings;
  theme: ReaderTheme;
}

export default function ReaderPage({
  books,
  onActiveBookChange,
  onSettingsChange,
  onSettingsReset,
  onThemeChange,
  settings,
  theme,
}: ReaderPageProps) {
  const { bookId } = useParams<{ bookId: string }>();
  const book = books.find((item) => item.id === bookId);

  useEffect(() => {
    if (bookId) {
      onActiveBookChange(bookId);
      void saveActiveBookId(bookId);
    }
  }, [bookId, onActiveBookChange]);

  if (!bookId || !book) {
    return <Navigate to="/" replace />;
  }

  return (
    <BookView
      book={book}
      onSettingsChange={onSettingsChange}
      onSettingsReset={onSettingsReset}
      onThemeChange={onThemeChange}
      settings={settings}
      theme={theme}
    />
  );
}

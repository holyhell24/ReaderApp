import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import BookView from "../components/BookView";
import { saveActiveBookId } from "../utils/bookStorage";
import type { ReaderPageProps } from "./types";

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

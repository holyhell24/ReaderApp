import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import BookView from "../components/BookView";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveBook } from "../store/booksSlice";
import type { ReaderSettings, ReaderTheme } from "../theme";
import { saveActiveBookId } from "../utils/bookStorage";

interface ReaderPageProps {
  onSettingsChange: (settings: ReaderSettings) => void;
  onSettingsReset: () => void;
  onThemeChange: (theme: ReaderTheme) => void;
  settings: ReaderSettings;
  theme: ReaderTheme;
}

export default function ReaderPage({
  onSettingsChange,
  onSettingsReset,
  onThemeChange,
  settings,
  theme,
}: ReaderPageProps) {
  const { bookId } = useParams<{ bookId: string }>();
  const dispatch = useAppDispatch();
  const book = useAppSelector((state) =>
    state.books.items.find((item) => item.id === bookId),
  );

  useEffect(() => {
    if (bookId) {
      dispatch(setActiveBook(bookId));
      void saveActiveBookId(bookId);
    }
  }, [bookId, dispatch]);

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

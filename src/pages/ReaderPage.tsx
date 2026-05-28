import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import BookView from "../components/BookView";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveBook } from "../store/booksSlice";
import type { ReaderTheme } from "../theme";
import { saveActiveBookId } from "../utils/bookStorage";

interface ReaderPageProps {
  onThemeChange: (theme: ReaderTheme) => void;
  theme: ReaderTheme;
}

export default function ReaderPage({ onThemeChange, theme }: ReaderPageProps) {
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

  return <BookView book={book} onThemeChange={onThemeChange} theme={theme} />;
}

import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import EpubReader from "../components/EpubReader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveBook } from "../store/booksSlice";
import { saveActiveBookId } from "../utils/bookStorage";

export default function ReaderPage() {
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
    <main className="flex h-dvh w-full flex-col">
      <header className="flex w-full shrink-0 items-center gap-4 border-b border-gray-200 px-4 py-1">
        <Link
          to="/"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Back
        </Link>
      </header>

      <div className="min-h-0 w-full flex-1">
        <EpubReader url={book.url} />
      </div>
    </main>
  );
}

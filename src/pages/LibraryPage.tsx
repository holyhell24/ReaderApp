import { useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import BookListItem from "../components/BookListItem";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addBook, setActiveBook, updateBook } from "../store/booksSlice";
import {
  saveActiveBookId,
  saveBook,
  updateStoredBookMetadata,
} from "../utils/bookStorage";
import { isEpubFile, parseEpubMetadata } from "../utils/epubMetadata";
import { readerThemes, type ReaderTheme } from "../theme";

interface LibraryPageProps {
  onThemeChange: (theme: ReaderTheme) => void;
  theme: ReaderTheme;
}

export default function LibraryPage({
  onThemeChange,
  theme,
}: LibraryPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const books = useAppSelector((state) => state.books.items);
  const activeBookId = useAppSelector((state) => state.books.activeBookId);
  const themeColors = readerThemes[theme];

  const handleAddBook = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !isEpubFile(file)) {
      return;
    }

    const id = crypto.randomUUID();
    const url = await file.arrayBuffer();
    const title = file.name.replace(/\.epub$/i, "");

    dispatch(addBook({ id, url, title }));
    void saveActiveBookId(id);
    void saveBook(id, file, { title }, url);

    const metadata = await parseEpubMetadata(file);
    dispatch(updateBook({ id, ...metadata }));
    void updateStoredBookMetadata(id, metadata);

    navigate(`/read/${id}`);
  };

  const handleSelectBook = (bookId: string) => {
    dispatch(setActiveBook(bookId));
    void saveActiveBookId(bookId);
    navigate(`/read/${bookId}`);
  };

  return (
    <main
      className="mx-auto min-h-dvh max-w-3xl p-6"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.foreground,
      }}
    >
      <div className="flex justify-between">
        <h1 className="mb-6 text-2xl font-semibold">My books</h1>
        <h1 className="mb-6 text-2xl font-semibold">Theme</h1>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".epub,application/epub+zip"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex justify-between flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleAddBook}
          className="cursor-pointer rounded-lg border px-4 py-2 font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: themeColors.foreground,
            borderColor: themeColors.foreground,
            color: themeColors.background,
          }}
        >
          Add book
        </button>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(readerThemes) as ReaderTheme[]).map((themeName) => (
            <button
              key={themeName}
              type="button"
              onClick={() => onThemeChange(themeName)}
              className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor:
                  theme === themeName ? themeColors.foreground : "transparent",
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

      {books.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {books.map((book) => (
            <BookListItem
              key={book.id}
              book={book}
              isActive={book.id === activeBookId}
              onSelect={() => handleSelectBook(book.id)}
              theme={theme}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-6" style={{ color: themeColors.muted }}>
          No books yet.
        </p>
      )}
    </main>
  );
}

import { useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import BookListItem from "../components/BookListItem";
import {
  removeStoredBook,
  saveActiveBookId,
  saveBook,
  updateStoredBookMetadata,
} from "../utils/bookStorage";
import { isEpubFile, parseEpubMetadata } from "../utils/epubMetadata";
import { readerThemes, type ReaderTheme } from "../theme";
import type { Book, BookMetadata } from "../types/types";

interface LibraryPageProps {
  activeBookId: string | null;
  books: Book[];
  onActiveBookChange: (bookId: string | null) => void;
  onBookAdd: (book: Book) => void;
  onBookRemove: (bookId: string) => void;
  onBookUpdate: (bookId: string, metadata: Partial<BookMetadata>) => void;
  onThemeChange: (theme: ReaderTheme) => void;
  theme: ReaderTheme;
}

export default function LibraryPage({
  activeBookId,
  books,
  onActiveBookChange,
  onBookAdd,
  onBookRemove,
  onBookUpdate,
  onThemeChange,
  theme,
}: LibraryPageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

    onBookAdd({ id, url, title });
    void saveActiveBookId(id);
    void saveBook(id, file, { title }, url);

    const metadata = await parseEpubMetadata(file);
    onBookUpdate(id, metadata);
    void updateStoredBookMetadata(id, metadata);

    navigate(`/read/${id}`);
  };

  const handleSelectBook = (bookId: string) => {
    onActiveBookChange(bookId);
    void saveActiveBookId(bookId);
    navigate(`/read/${bookId}`);
  };

  const handleRemoveBook = (bookId: string) => {
    const remainingBooks = books.filter((book) => book.id !== bookId);
    const nextActiveBookId =
      activeBookId === bookId
        ? (remainingBooks[0]?.id ?? null)
        : activeBookId;

    onBookRemove(bookId);
    void removeStoredBook(bookId).then(() => saveActiveBookId(nextActiveBookId));
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
              onRemove={() => handleRemoveBook(book.id)}
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

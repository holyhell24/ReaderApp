import { useEffect, useRef, useState, type ChangeEvent } from "react";
import BookListItem from "./components/BookListItem";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  addBook,
  hydrateBooks,
  setActiveBook,
  updateBook,
} from "./store/booksSlice";
import {
  loadLibrary,
  saveActiveBookId,
  saveBook,
  updateStoredBookMetadata,
} from "./utils/bookStorage";
import { isEpubFile, parseEpubMetadata } from "./utils/epubMetadata";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const books = useAppSelector((state) => state.books.items);
  const activeBookId = useAppSelector((state) => state.books.activeBookId);
  const [isLibraryReady, setIsLibraryReady] = useState(false);

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
    const url = URL.createObjectURL(file);
    const title = file.name.replace(/\.epub$/i, "");

    dispatch(addBook({ id, url, title }));
    void saveActiveBookId(id);
    void saveBook(id, file, { title });

    const metadata = await parseEpubMetadata(file);
    dispatch(updateBook({ id, ...metadata }));
    void updateStoredBookMetadata(id, metadata);
  };

  const handleSelectBook = (bookId: string) => {
    dispatch(setActiveBook(bookId));
    void saveActiveBookId(bookId);
  };

  if (!isLibraryReady) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-gray-500">Loading library…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">My books</h1>

      <input
        ref={fileInputRef}
        type="file"
        accept=".epub,application/epub+zip"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleAddBook}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Add book
      </button>

      {books.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {books.map((book) => (
            <BookListItem
              key={book.id}
              book={book}
              isActive={book.id === activeBookId}
              onSelect={() => handleSelectBook(book.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-gray-500">No books yet.</p>
      )}
    </main>
  );
}

export default App;

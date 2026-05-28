import { useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import BookListItem from "../components/BookListItem/BookListItem";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addBook, setActiveBook, updateBook } from "../store/booksSlice";
import {
  saveActiveBookId,
  saveBook,
  updateStoredBookMetadata,
} from "../utils/bookStorage";
import { isEpubFile, parseEpubMetadata } from "../utils/epubMetadata";

export default function LibraryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const books = useAppSelector((state) => state.books.items);
  const activeBookId = useAppSelector((state) => state.books.activeBookId);

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
        className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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

import { useCallback, useEffect, useState } from "react";
import type { Book, BooksState } from "../types/types";
import {
  loadLibrary,
  removeStoredBook,
  saveActiveBookId,
  saveBook,
} from "../utils/bookStorage";
import {
  isEpubFile,
  parseEpubMetadataFromData,
} from "../utils/epubMetadata";

const EMPTY_LIBRARY: BooksState = {
  activeBookId: null,
  items: [],
};

export function useLibrary() {
  const [isLibraryReady, setIsLibraryReady] = useState(false);
  const [library, setLibrary] = useState<BooksState>(EMPTY_LIBRARY);

  const addBook = useCallback(async (file: File): Promise<string | null> => {
    if (!isEpubFile(file)) return null;

    const id = crypto.randomUUID();
    const data = await file.arrayBuffer();
    const metadata = await parseEpubMetadataFromData(data, file.name);
    const book: Book = {
      id,
      url: data,
      ...metadata,
    };

    setLibrary((currentLibrary) => ({
      activeBookId: id,
      items: [...currentLibrary.items, book],
    }));

    await Promise.all([
      saveActiveBookId(id),
      saveBook(id, file, metadata, data),
    ]);

    return id;
  }, []);

  const removeBook = useCallback(async (id: string) => {
    let nextActiveBookId: string | null = null;

    setLibrary((currentLibrary) => {
      const items = currentLibrary.items.filter((book) => book.id !== id);
      nextActiveBookId =
        currentLibrary.activeBookId === id
          ? (items[0]?.id ?? null)
          : currentLibrary.activeBookId;

      return {
        activeBookId: nextActiveBookId,
        items,
      };
    });

    await removeStoredBook(id);
    await saveActiveBookId(nextActiveBookId);
  }, []);

  const selectBook = useCallback((activeBookId: string | null) => {
    setLibrary((currentLibrary) => ({
      ...currentLibrary,
      activeBookId,
    }));
    void saveActiveBookId(activeBookId);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadLibrary()
      .then((loadedLibrary) => {
        if (!cancelled) {
          setLibrary(loadedLibrary);
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
  }, []);

  return {
    addBook,
    isLibraryReady,
    library,
    removeBook,
    selectBook,
  };
}

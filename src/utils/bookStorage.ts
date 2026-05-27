import type { Book, BookMetadata } from "../types/types";
import type { LibraryMeta, StoredBook } from "./types";

const DB_NAME = "reader-app";
const DB_VERSION = 1;
const BOOKS_STORE = "books";
const META_STORAGE_KEY = "reader-app-library-meta";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BOOKS_STORE)) {
        db.createObjectStore(BOOKS_STORE, { keyPath: "id" });
      }
    };
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => Promise<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(BOOKS_STORE, mode);
        const store = transaction.objectStore(BOOKS_STORE);

        transaction.onerror = () =>
          reject(transaction.error ?? new Error("IndexedDB transaction failed"));
        transaction.oncomplete = () => {};

        operation(store).then(resolve).catch(reject);
      }),
  );
}

function getFromStore<T>(store: IDBObjectStore, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

function putInStore(store: IDBObjectStore, value: StoredBook): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = store.put(value);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function getAllFromStore(store: IDBObjectStore): Promise<StoredBook[]> {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve((request.result as StoredBook[]) ?? []);
    request.onerror = () => reject(request.error);
  });
}

function storedBookToBook(stored: StoredBook): Book {
  const blob = new Blob([stored.data], { type: "application/epub+zip" });
  return {
    id: stored.id,
    title: stored.title,
    author: stored.author,
    description: stored.description,
    url: URL.createObjectURL(blob),
  };
}

function readLibraryMeta(): LibraryMeta {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    if (!raw) return { activeBookId: null };
    return JSON.parse(raw) as LibraryMeta;
  } catch {
    return { activeBookId: null };
  }
}

function writeLibraryMeta(meta: LibraryMeta): void {
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
}

export async function saveBook(
  id: string,
  file: File,
  metadata: BookMetadata,
): Promise<void> {
  const stored: StoredBook = {
    id,
    fileName: file.name,
    title: metadata.title,
    author: metadata.author,
    description: metadata.description,
    data: await file.arrayBuffer(),
  };

  await runTransaction("readwrite", (store) => putInStore(store, stored));
}

export async function updateStoredBookMetadata(
  id: string,
  metadata: Partial<BookMetadata>,
): Promise<void> {
  await runTransaction("readwrite", async (store) => {
    const existing = await getFromStore<StoredBook>(store, id);
    if (!existing) return;

    await putInStore(store, {
      ...existing,
      ...metadata,
      title: metadata.title ?? existing.title,
    });
  });
}

export async function saveActiveBookId(activeBookId: string | null): Promise<void> {
  writeLibraryMeta({ activeBookId });
}

export async function loadLibrary(): Promise<{
  items: Book[];
  activeBookId: string | null;
}> {
  const storedBooks = await runTransaction("readonly", (store) =>
    getAllFromStore(store),
  );
  const meta = readLibraryMeta();

  const items = storedBooks.map(storedBookToBook);
  const activeBookId =
    meta.activeBookId && items.some((book) => book.id === meta.activeBookId)
      ? meta.activeBookId
      : (items[0]?.id ?? null);

  return { items, activeBookId };
}

export interface BookMetadata {
  title: string;
  author?: string;
  description?: string;
}

export interface Book extends BookMetadata {
  id: string;
  url: string | ArrayBuffer;
}

export interface BooksState {
  items: Book[];
  activeBookId: string | null;
}

export type AddBookPayload = Book;

import type { Book } from "../types/types";

export interface BookListItemProps {
  book: Book;
  isActive: boolean;
  onSelect: () => void;
}

export interface EpubReaderProps {
  url: string;
}

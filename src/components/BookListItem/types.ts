import type { Book } from "../../types/types";
import type { ReaderTheme } from "../../theme";

export interface BookListItemProps {
  book: Book;
  isActive: boolean;
  onRemove: () => void;
  onSelect: () => void;
  theme: ReaderTheme;
}

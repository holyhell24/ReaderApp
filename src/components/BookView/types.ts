import type { Book } from "../../types/types";
import type { ReaderTheme } from "../../theme";

export interface BookViewProps {
  book: Book;
  onThemeChange: (theme: ReaderTheme) => void;
  theme: ReaderTheme;
}

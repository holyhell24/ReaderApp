import type { ReaderSettings, ReaderTheme } from "../theme";
import type { Book } from "../types/types";

export interface LibraryPageProps {
  activeBookId: string | null;
  books: Book[];
  onBookAdd: (file: File) => Promise<string | null>;
  onBookRemove: (bookId: string) => Promise<void>;
  onBookSelect: (bookId: string | null) => void;
  onThemeChange: (theme: ReaderTheme) => void;
  theme: ReaderTheme;
}

export interface ReaderPageProps {
  books: Book[];
  onActiveBookChange: (bookId: string | null) => void;
  onSettingsChange: (settings: ReaderSettings) => void;
  onSettingsReset: () => void;
  onThemeChange: (theme: ReaderTheme) => void;
  settings: ReaderSettings;
  theme: ReaderTheme;
}

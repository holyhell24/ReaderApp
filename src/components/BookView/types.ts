import type { Book } from "../../types/types";
import type { ReaderSettings, ReaderTheme } from "../../theme";

export interface BookViewProps {
  book: Book;
  onSettingsChange: (settings: ReaderSettings) => void;
  onSettingsReset: () => void;
  onThemeChange: (theme: ReaderTheme) => void;
  settings: ReaderSettings;
  theme: ReaderTheme;
}

export interface ReaderTocItem {
  href: string;
  label: string;
  subitems?: ReaderTocItem[];
}

export interface TocMatch {
  href: string;
  index: number;
  label: string;
  parentLabel?: string;
}

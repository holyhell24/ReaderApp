import type { ReaderThemeConfig } from "../../../../theme";
import type { ReaderTocItem } from "../../types";

export interface ChapterListProps {
  items: ReaderTocItem[];
  onSelect: (href: string) => void;
  themeColors: ReaderThemeConfig;
}

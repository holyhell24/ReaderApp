import type { ReaderTheme, ReaderThemeConfig } from "../../../../theme";
import type { ReaderTocItem } from "../../types";

export interface ChaptersDrawerProps {
  onChapterSelect: (href: string) => void;
  onClose: () => void;
  themeColors: ReaderThemeConfig;
  toc: ReaderTocItem[];
}

export interface SettingsDrawerProps {
  onClose: () => void;
  onThemeChange: (theme: ReaderTheme) => void;
  theme: ReaderTheme;
  themeColors: ReaderThemeConfig;
}

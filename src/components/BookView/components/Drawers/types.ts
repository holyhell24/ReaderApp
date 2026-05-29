import type {
  ReaderSettings,
  ReaderTheme,
  ReaderThemeConfig,
} from "../../../../theme";
import type { ReaderTocItem } from "../../types";

export interface ChaptersDrawerProps {
  onChapterSelect: (href: string) => void;
  onClose: () => void;
  themeColors: ReaderThemeConfig;
  toc: ReaderTocItem[];
}

export interface SettingsDrawerProps {
  onClose: () => void;
  onSettingsChange: (settings: ReaderSettings) => void;
  onSettingsReset: () => void;
  onThemeChange: (theme: ReaderTheme) => void;
  settings: ReaderSettings;
  theme: ReaderTheme;
  themeColors: ReaderThemeConfig;
}

export interface SoundsDrawerProps {
  sceneSoundPreset?: string | null;
  sceneSoundPresetKey?: string | null;
  themeColors: ReaderThemeConfig;
}

import type { ReaderSettings, ReaderTheme } from "../../../../theme";
import type { ReaderTocItem } from "../../types";

export interface EpubReaderProps {
  location: string | number;
  onLocationChange: (location: string) => void;
  onTocChange: (toc: ReaderTocItem[]) => void;
  settings: ReaderSettings;
  theme: ReaderTheme;
  url: string | ArrayBuffer;
}

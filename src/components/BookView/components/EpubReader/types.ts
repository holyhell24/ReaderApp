import type { ReaderTheme } from "../../../../theme";
import type { ReaderTocItem } from "../../types";

export interface EpubReaderProps {
  location: string | number;
  onLocationChange: (location: string) => void;
  onTocChange: (toc: ReaderTocItem[]) => void;
  theme: ReaderTheme;
  url: string | ArrayBuffer;
}

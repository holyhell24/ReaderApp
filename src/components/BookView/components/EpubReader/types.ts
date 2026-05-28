import type { ReaderTheme } from "../../../../theme";

export interface EpubReaderProps {
  location: string | number;
  onLocationChange: (location: string) => void;
  onTocChange: (toc: ReaderTocItem[]) => void;
  theme: ReaderTheme;
  url: string | ArrayBuffer;
}

export interface ReaderTocItem {
  href: string;
  label: string;
  subitems?: ReaderTocItem[];
}
